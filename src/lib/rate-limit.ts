type Key = string

// Janela deslizante simples por minuto em memória
// Estrutura: map[key] = { windowStart: number (ms), count: number, limit: number }
const buckets = new Map<Key, { windowStart: number; count: number; limit: number }>()

function getIpFromHeaders(headers: Headers): string | null {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return null
}

export function getRequesterIp(headers: Headers, fallbackIp?: string | null): string | null {
  return getIpFromHeaders(headers) || fallbackIp || null
}

export function rateLimitCheck(key: string, limitPerMinute: number): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  const windowSize = 60_000
  const windowStart = now - (now % windowSize)

  const existing = buckets.get(key)
  if (!existing || existing.windowStart !== windowStart) {
    buckets.set(key, { windowStart, count: 1, limit: limitPerMinute })
    return { allowed: true, remaining: Math.max(0, limitPerMinute - 1), resetMs: windowStart + windowSize - now }
  }

  if (existing.count >= (existing.limit || limitPerMinute)) {
    return { allowed: false, remaining: 0, resetMs: existing.windowStart + windowSize - now }
  }

  existing.count += 1
  existing.limit = limitPerMinute
  return { allowed: true, remaining: Math.max(0, existing.limit - existing.count), resetMs: existing.windowStart + windowSize - now }
}
