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

export async function POST(req: NextRequest) {
  try {
    const userId = requireUserId(req)
    const body = await req.json().catch(() => null)
    const id = body?.id as string | undefined
    if (!id) return NextResponse.json({ success: false, error: 'id obrigatório' }, { status: 400 })

    // Carregar chave existente do usuário
    const rows: any[] = await prisma.$queryRaw`
      SELECT id, name, status, expires_at, ip_allowlist, rate_limit_per_minute
      FROM api_keys
      WHERE id = ${id} AND user_id = ${userId}
      LIMIT 1
    `
    if (rows.length === 0) return NextResponse.json({ success: false, error: 'Chave não encontrada' }, { status: 404 })
    const existing = rows[0]

    // Carregar escopo (instâncias) da chave existente
    const instRows: any[] = await prisma.$queryRaw`
      SELECT instance_id FROM api_key_instances WHERE api_key_id = ${id}
    `
    const instanceIds: string[] = instRows.map(r => r.instance_id)

    // Definir novos atributos (override se enviados)
    const name: string | null = body?.name ?? existing.name ?? null
    const expiresAt: Date | null = body?.expiresAt ? new Date(body.expiresAt) : (existing.expires_at ? new Date(existing.expires_at) : null)
    const ipAllowlist: string | null = Array.isArray(body?.ipAllowlist)
      ? JSON.stringify(body.ipAllowlist)
      : (existing.ip_allowlist ?? null)
    const rate: number | null = Number.isFinite(body?.rateLimitPerMinute)
      ? body.rateLimitPerMinute
      : (existing.rate_limit_per_minute ?? null)

    // Gerar nova chave
    const secret = crypto.randomBytes(24).toString('base64url')
    const salt = crypto.randomBytes(16).toString('hex')
    const keyHash = deriveHash(secret, salt)
    const last8 = secret.slice(-8)
    const newId = crypto.randomBytes(16).toString('hex')

    // Transação: criar nova chave, copiar escopo, (opcional) revogar antiga
    await prisma.$executeRaw`BEGIN`
    try {
      await prisma.$executeRaw`
        INSERT INTO api_keys (
          id, user_id, name, key_hash, salt, status, expires_at,
          ip_allowlist, rate_limit_per_minute, last8, created_at, updated_at
        ) VALUES (
          ${newId}, ${userId}, ${name}, ${keyHash}, ${salt}, 'active',
          ${expiresAt}, ${ipAllowlist}, ${rate}, ${last8}, now(), now()
        )
      `

      for (const instanceId of instanceIds) {
        const linkId = crypto.randomBytes(16).toString('hex')
        await prisma.$executeRaw`
          INSERT INTO api_key_instances (id, api_key_id, instance_id, created_at)
          VALUES (${linkId}, ${newId}, ${instanceId}, now())
          ON CONFLICT (api_key_id, instance_id) DO NOTHING
        `
      }

      if (body?.revokeOld === true) {
        await prisma.$executeRaw`UPDATE api_keys SET status = 'revoked', updated_at = now() WHERE id = ${id}`
      }

      await prisma.$executeRaw`COMMIT`
    } catch (e) {
      await prisma.$executeRaw`ROLLBACK`
      throw e
    }

    const token = `zap_${newId}_${secret}`
    return NextResponse.json({ success: true, id: newId, token, last8, copiedInstances: instanceIds.length })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ success: false, error: e?.message || 'Erro' }, { status })
  }
}
