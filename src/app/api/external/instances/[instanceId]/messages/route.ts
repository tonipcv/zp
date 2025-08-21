import { NextResponse } from 'next/server'
import { WhatsAppService } from '@/lib/whatsapp-service'
import { validateExternalApiKey } from '@/lib/external-auth'
import { rateLimitCheck, getRequesterIp } from '@/lib/rate-limit'

const whatsappService = new WhatsAppService(
  process.env.EVOLUTION_API_URL || 'https://boop-evolution-api.dpbdp1.easypanel.host',
  process.env.EVOLUTION_API_KEY
)

// Suporte legado: EXTERNAL_API_KEY
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY

export async function POST(request: Request, { params }: any) {
  const { instanceId } = params
  try {
    // 1) Validar nova API key (escopo) ou cair no legado
    let scoped = false
    let allowedInstanceIds: string[] = []
    let rateLimitPerMinute = 60
    let apiKeyId: string | null = null
    try {
      const auth = await validateExternalApiKey(request)
      allowedInstanceIds = auth.allowedInstanceIds || []
      apiKeyId = auth.apiKeyId
      rateLimitPerMinute = auth.rateLimitPerMinute ?? 60
      scoped = true
      if (!allowedInstanceIds.includes(instanceId)) {
        return NextResponse.json(
          { success: false, error: 'API key não tem acesso a esta instância' },
          { status: 403 }
        )
      }
    } catch (e: any) {
      const headerKey = request.headers.get('x-api-key')
      if (!headerKey || !EXTERNAL_API_KEY || headerKey !== EXTERNAL_API_KEY) {
        return NextResponse.json(
          { success: false, error: 'API Key inválida ou ausente. Use o header x-api-key.' },
          { status: 401 }
        )
      }
    }

    // 1.1) Rate limit por API key (quando escopado)
    if (scoped && apiKeyId) {
      const rl = rateLimitCheck(`ext:msg:key:${apiKeyId}`, rateLimitPerMinute)
      if (!rl.allowed) {
        return NextResponse.json(
          { success: false, error: 'Rate limit excedido para a API key' },
          { status: 429 }
        )
      }
    }

    // 1.2) Rate limit por IP (sempre aplica, inclusive legado)
    const ip = getRequesterIp(request.headers, (request as any).ip)
    if (ip) {
      const rlIp = rateLimitCheck(`ext:msg:ip:${ip}`, 60)
      if (!rlIp.allowed) {
        return NextResponse.json(
          { success: false, error: 'Rate limit excedido para o IP' },
          { status: 429 }
        )
      }
    }

    // 2) Validar payload
    const body = await request.json().catch(() => null)
    if (!body || typeof body.number !== 'string' || typeof body.message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Payload inválido. Esperado: { number: string, message: string }' },
        { status: 400 }
      )
    }
    const number = String(body.number).trim()
    const message = String(body.message)

    // 3) Opcional: Idempotency-Key (a implementar futuramente)
    // const idem = request.headers.get('Idempotency-Key') || null

    // 4) Enviar sem debitar créditos
    const result = await whatsappService.sendTextMessage(instanceId, number, message, 'external-system')

    return NextResponse.json(
      {
        success: true,
        instanceId,
        status: 'sent',
        messageId: result?.messageId || result?.id || undefined,
        timestamp: new Date().toISOString(),
        scoped
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[EXTERNAL_API] Erro ao enviar mensagem:', error)
    const status = error?.status && Number.isInteger(error.status) ? error.status : 500
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status }
    )
  }
}
