import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

/** Cookie de sesión del dashboard. httpOnly: el navegador la envía, pero el JS de la página no puede leerla. */
export const SESSION_COOKIE = 'gg_dashboard'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

function secret(): string | null {
  return process.env.DASHBOARD_PASSWORD || null
}

/** Compara dos textos en tiempo constante (evita deducir la clave midiendo tiempos de respuesta). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

function sign(exp: number, key: string): string {
  return createHmac('sha256', key).update(`dashboard:${exp}`).digest('base64url')
}

export function passwordMatches(input: unknown): boolean {
  const key = secret()
  return !!key && typeof input === 'string' && input.length > 0 && safeEqual(input, key)
}

/** Token firmado "caducidad.firma". No contiene la contraseña y deja de valer al caducar o al cambiarla. */
export function createSessionToken(): string {
  const key = secret()
  if (!key) throw new Error('DASHBOARD_PASSWORD not configured')
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  return `${exp}.${sign(exp, key)}`
}

function sessionIsValid(token: string | undefined): boolean {
  const key = secret()
  if (!key || !token) return false
  const [expRaw, sig] = token.split('.')
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || !sig || exp < Date.now() / 1000) return false
  return safeEqual(sig, sign(exp, key))
}

/**
 * Autoriza si la petición trae una sesión válida del dashboard (cookie) o,
 * para llamadas internas de servidor a servidor, la contraseña como Bearer.
 */
export function isAuthorized(req: NextRequest): boolean {
  if (sessionIsValid(req.cookies.get(SESSION_COOKIE)?.value)) return true
  const header = req.headers.get('authorization')
  return !!header?.startsWith('Bearer ') && passwordMatches(header.slice(7))
}
