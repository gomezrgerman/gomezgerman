import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'

type Window = `${number} ${'s' | 'm' | 'h'}`

interface Rule {
  /** Separa los contadores de cada endpoint. */
  prefix: string
  limit: number
  window: Window
}

const CONTACT: Rule = { prefix: 'contact', limit: 5, window: '10 m' }

const limiters = new Map<string, Ratelimit>()

function upstash(rule: Rule): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const id = `${rule.prefix}:${rule.limit}:${rule.window}`
  const existing = limiters.get(id)
  if (existing) return existing
  const created = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(rule.limit, rule.window),
    prefix: `rl:${rule.prefix}`,
    analytics: false,
  })
  limiters.set(id, created)
  return created
}

function windowMs(w: Window): number {
  const [n, unit] = w.split(' ')
  return Number(n) * (unit === 's' ? 1_000 : unit === 'm' ? 60_000 : 3_600_000)
}

/**
 * Respaldo en memoria si Upstash no está configurado. Cada instancia de servidor
 * lleva su propia cuenta, así que es más débil que Upstash, pero nunca deja pasar todo.
 */
const memory = new Map<string, number[]>()

function memoryLimit(rule: Rule, key: string): boolean {
  const now = Date.now()
  const id = `${rule.prefix}:${key}`
  const recent = (memory.get(id) ?? []).filter((t) => now - t < windowMs(rule.window))
  if (recent.length >= rule.limit) {
    memory.set(id, recent)
    return false
  }
  memory.set(id, [...recent, now])
  if (memory.size > 5_000) memory.clear()
  return true
}

/** true si la petición puede continuar; false si ha superado el límite. */
export async function checkRateLimit(key: string, rule: Rule = CONTACT): Promise<boolean> {
  const limiter = upstash(rule)
  if (!limiter) return memoryLimit(rule, key)
  const { success } = await limiter.limit(key)
  return success
}

export function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
}
