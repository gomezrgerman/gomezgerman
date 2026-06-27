import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let _limiter: Ratelimit | null = null

function getLimiter(): Ratelimit | null {
  if (_limiter) return _limiter
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    analytics: false,
  })
  return _limiter
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  const limiter = getLimiter()
  if (!limiter) return true // si no hay Upstash configurado, deja pasar
  const { success } = await limiter.limit(ip)
  return success
}
