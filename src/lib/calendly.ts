import { prisma } from '@/lib/prisma'
import { addSeconds } from 'date-fns'

const CALENDLY_API_BASE = 'https://api.calendly.com'
const CALENDLY_OAUTH_TOKEN_URL = 'https://auth.calendly.com/oauth/token'

export type CalendlyTokenResponse = {
  token_type: string
  access_token: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}

export async function getUserCalendlyConnection(userId: string) {
  return prisma.calendlyConnection.findUnique({ where: { userId } })
}

export async function saveCalendlyConnection(params: {
  userId: string
  ownerUri: string
  ownerEmail?: string | null
  organizationUri: string
  accessToken: string
  refreshToken?: string | null
  expiresIn?: number
}) {
  const expiresAt = params.expiresIn ? addSeconds(new Date(), params.expiresIn) : null

  return prisma.calendlyConnection.upsert({
    where: { userId: params.userId },
    update: {
      ownerUri: params.ownerUri,
      ownerEmail: params.ownerEmail ?? undefined,
      organizationUri: params.organizationUri,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken ?? undefined,
      expiresAt: expiresAt ?? undefined,
    },
    create: {
      userId: params.userId,
      ownerUri: params.ownerUri,
      ownerEmail: params.ownerEmail ?? undefined,
      organizationUri: params.organizationUri,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken ?? undefined,
      expiresAt: expiresAt ?? undefined,
    },
  })
}

export async function refreshCalendlyToken(connectionId: string) {
  const conn = await prisma.calendlyConnection.findUnique({ where: { id: connectionId } })
  if (!conn?.refreshToken) return conn

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: conn.refreshToken,
  })

  const res = await fetch(CALENDLY_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body,
  })
  if (!res.ok) {
    throw new Error(`Calendly refresh failed: ${res.status} ${await res.text()}`)
  }
  const data: CalendlyTokenResponse = await res.json()
  const expiresAt = data.expires_in ? addSeconds(new Date(), data.expires_in) : null

  return prisma.calendlyConnection.update({
    where: { id: connectionId },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? undefined,
      expiresAt: expiresAt ?? undefined,
    },
  })
}

export async function withCalendlyAccessToken<T>(userId: string, fn: (token: string) => Promise<T>): Promise<T> {
  let conn = await prisma.calendlyConnection.findUnique({ where: { userId } })
  if (!conn) throw new Error('Calendly not connected for this user')

  const needsRefresh = conn.expiresAt && new Date(conn.expiresAt).getTime() - Date.now() < 60_000
  if (needsRefresh && conn.refreshToken) {
    conn = await refreshCalendlyToken(conn.id)
  }
  return fn(conn.accessToken)
}

export async function calendlyApi<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CALENDLY_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Calendly API ${path} failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<T>
}

export async function getCalendlyCurrentUser(token: string) {
  return calendlyApi<{ resource: { uri: string; email: string; current_organization: string } }>(token, '/users/me')
}

export async function getCalendlyEventTypes(token: string, ownerUri: string) {
  const params = new URLSearchParams({
    user: ownerUri,
    active: 'true',
    count: '100',
  })
  return calendlyApi<{ collection: any[] }>(token, `/event_types?${params.toString()}`)
}

// Cria uma assinatura de webhook no Calendly para a organização informada
export async function createCalendlyWebhook(
  token: string,
  organizationUri: string,
  webhookUrl: string,
  events: string[],
  signingKey: string
) {
  // Ver documentação oficial do Calendly para o payload exato de webhook_subscriptions
  const body = {
    url: webhookUrl,
    events,
    organization: organizationUri,
    scope: organizationUri,
    signing_key: signingKey,
  } as any

  return calendlyApi<any>(token, '/webhook_subscriptions', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Revoga o token de atualização no endpoint de revogação do Calendly
export async function revokeCalendlyToken(refreshToken: string) {
  const revokeUrl = 'https://auth.calendly.com/oauth/revoke'
  const body = new URLSearchParams({
    token: refreshToken,
    token_type_hint: 'refresh_token',
  })

  const res = await fetch(revokeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body,
  })

  if (!res.ok) {
    // Não lançar erro fatal na revogação para não quebrar o fluxo de desconexão
    const text = await res.text().catch(() => '')
    console.warn('Calendly revoke token falhou:', res.status, text)
  }

  return { success: res.ok }
}

export function verifyCalendlySignature(rawBody: string, signatureHeader?: string) {
  // Para sandbox inicial, usar chave fixa do .env
  const signingKey = process.env.CALENDLY_SIGNING_KEY
  if (!signingKey || !signatureHeader) return false
  // Assinatura é HMAC-SHA256 do corpo
  const crypto = require('crypto') as typeof import('crypto')
  const expected = crypto.createHmac('sha256', signingKey).update(rawBody).digest('hex')
  // Header vem como 'sha256=...' em alguns provedores; aqui vamos aceitar final ou igual
  const sig = signatureHeader.split('=')[1] || signatureHeader
  return sig === expected
}
