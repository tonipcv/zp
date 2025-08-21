import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

// Token format: zap_<apiKeyId>_<secret>
function parseApiKey(raw: string | null): { id: string, secret: string } | null {
  if (!raw) return null
  const parts = raw.trim().split('_')
  if (parts.length < 3) return null
  const [prefix, id, ...rest] = parts
  if (prefix !== 'zap' || !id || rest.length === 0) return null
  const secret = rest.join('_')
  return { id, secret }
}

function deriveHash(secret: string, salt: string): string {
  // scrypt for strong KDF
  const key = crypto.scryptSync(secret, salt, 32)
  return key.toString('hex')
}

function ipAllowed(ipAllowlistJson: string | null | undefined, ip: string | null): boolean {
  if (!ipAllowlistJson) return true
  try {
    const list = JSON.parse(ipAllowlistJson)
    if (!Array.isArray(list)) return true
    if (!ip) return false
    return list.includes(ip)
  } catch {
    return true
  }
}

export async function validateExternalApiKey(req: Request | NextRequest): Promise<{
  apiKeyId: string
  userId: string
  allowedInstanceIds: string[]
  rateLimitPerMinute: number | null
}> {
  const raw = req.headers.get('x-api-key')
  const parsed = parseApiKey(raw)
  if (!parsed) {
    throw Object.assign(new Error('Missing or invalid x-api-key'), { status: 401 })
  }

  // Usar SQL direto para evitar problemas com nomes de colunas
  const apiKeyResult = await prisma.$queryRaw`
    SELECT ak.*, array_agg(aki.instance_id) as instance_ids
    FROM api_keys ak
    LEFT JOIN api_key_instances aki ON aki.api_key_id = ak.id
    WHERE ak.id = ${parsed.id}
    GROUP BY ak.id
  `
  
  const apiKey = Array.isArray(apiKeyResult) && apiKeyResult.length > 0 ? apiKeyResult[0] : null
  if (!apiKey) {
    throw Object.assign(new Error('API key not found'), { status: 401 })
  }
  if (apiKey.status !== 'active') {
    throw Object.assign(new Error('API key revoked'), { status: 401 })
  }
  if (apiKey.expires_at && apiKey.expires_at < new Date()) {
    throw Object.assign(new Error('API key expired'), { status: 401 })
  }

  // Basic IP check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || (req as any).ip || null
  if (!ipAllowed(apiKey.ip_allowlist as any, ip)) {
    throw Object.assign(new Error('IP not allowed for this API key'), { status: 403 })
  }

  const computed = deriveHash(parsed.secret, apiKey.salt)
  if (computed !== apiKey.key_hash) {
    throw Object.assign(new Error('Invalid API key'), { status: 401 })
  }

  // Filtrar valores nulos do array de instâncias
  const allowedInstanceIds = (apiKey.instance_ids || []).filter(Boolean)

  // Update last_used_at non-blocking
  prisma.$executeRaw`
    UPDATE api_keys SET last_used_at = now() WHERE id = ${apiKey.id}
  `.catch(() => {})

  return { apiKeyId: apiKey.id, userId: apiKey.user_id, allowedInstanceIds, rateLimitPerMinute: apiKey.rate_limit_per_minute ?? null }
}

export function maskPhone(phone: string): string {
  if (!phone) return ''
  const last4 = phone.slice(-4)
  return `****${last4}`
}
