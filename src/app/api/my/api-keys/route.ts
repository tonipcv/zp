import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function requireUserId(req: NextRequest): string {
  const uid = req.headers.get('x-user-id')?.trim()
  if (!uid) throw Object.assign(new Error('Unauthorized: missing x-user-id'), { status: 401 })
  return uid
}

function deriveHash(secret: string, salt: string): string {
  const key = crypto.scryptSync(secret, salt, 32)
  return key.toString('hex')
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req)

    const rows: any[] = await prisma.$queryRaw`
      SELECT ak.id, ak.name, ak.status, ak.expires_at as "expiresAt", ak.last8,
             ak.last_used_at as "lastUsedAt", ak.created_at as "createdAt",
             COALESCE(json_agg(aki.instance_id) FILTER (WHERE aki.instance_id IS NOT NULL), '[]') AS instances
      FROM api_keys ak
      LEFT JOIN api_key_instances aki ON aki.api_key_id = ak.id
      WHERE ak.user_id = ${userId}
      GROUP BY ak.id
      ORDER BY ak.created_at DESC
    `

    return NextResponse.json({ success: true, items: rows })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ success: false, error: e?.message || 'Erro' }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = requireUserId(req)
    const body = await req.json().catch(() => null)
    if (!body || !Array.isArray(body.instanceIds) || body.instanceIds.length === 0) {
      return NextResponse.json({ success: false, error: 'instanceIds obrigatórios' }, { status: 400 })
    }

    const name: string | null = body.name || null
    const expiresAt: string | null = body.expiresAt || null // YYYY-MM-DD opcional
    const ipAllowlist: string | null = Array.isArray(body.ipAllowlist) ? JSON.stringify(body.ipAllowlist) : null
    const rate: number | null = Number.isFinite(body.rateLimitPerMinute) ? body.rateLimitPerMinute : null

    // Validar que as instâncias pertencem ao usuário
    const inst: any[] = await prisma.$queryRaw`
      SELECT id FROM whatsapp_instances WHERE "userId" = ${userId} AND id = ANY(${body.instanceIds})
    `
    const validIds = new Set(inst.map((r) => r.id))
    const scopedIds = body.instanceIds.filter((id: string) => validIds.has(id))
    if (scopedIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhuma instanceId válida para este usuário' }, { status: 400 })
    }

    const secret = crypto.randomBytes(24).toString('base64url')
    const salt = crypto.randomBytes(16).toString('hex')
    const keyHash = deriveHash(secret, salt)
    const last8 = secret.slice(-8)
    const keyId = crypto.randomBytes(16).toString('hex')

    await prisma.$executeRaw`
      INSERT INTO api_keys (
        id, user_id, name, key_hash, salt, status, expires_at,
        ip_allowlist, rate_limit_per_minute, last8, created_at, updated_at
      ) VALUES (
        ${keyId}, ${userId}, ${name}, ${keyHash}, ${salt}, 'active',
        ${expiresAt ? new Date(expiresAt) : null}, ${ipAllowlist}, ${rate}, ${last8}, now(), now()
      )
    `

    for (const instanceId of scopedIds) {
      const linkId = crypto.randomBytes(16).toString('hex')
      await prisma.$executeRaw`
        INSERT INTO api_key_instances (id, api_key_id, instance_id, created_at)
        VALUES (${linkId}, ${keyId}, ${instanceId}, now())
        ON CONFLICT (api_key_id, instance_id) DO NOTHING
      `
    }

    const token = `zap_${keyId}_${secret}`
    return NextResponse.json({ success: true, token, last8, id: keyId })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ success: false, error: e?.message || 'Erro' }, { status })
  }
}
