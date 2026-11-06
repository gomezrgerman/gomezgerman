/**
 * Acceso a Supabase (API REST) solo desde el servidor.
 * Usa la clave de servicio, así la tabla `submissions` puede quedar cerrada
 * a la clave pública (anon) con RLS sin romper el formulario ni el dashboard.
 */

let warned = false

export function supabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null
}

function serverKey(): string | null {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (service) return service
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (anon && !warned) {
    warned = true
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set: falling back to the anon key')
  }
  return anon || null
}

export function supabaseConfigured(): boolean {
  return !!supabaseUrl() && !!serverKey()
}

export function supabaseHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const key = serverKey() ?? ''
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra }
}

/** URL a la tabla `submissions` con filtros PostgREST; los valores se codifican para que no puedan añadir filtros. */
export function submissionsUrl(filters: Record<string, string> = {}): string {
  const query = Object.entries(filters)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return `${supabaseUrl()}/rest/v1/submissions${query ? `?${query}` : ''}`
}

/** Id de fila válido para usar en un filtro (texto o número, corto). */
export function isRowId(value: unknown): value is string | number {
  return (typeof value === 'string' && value.length > 0 && value.length <= 64)
    || (typeof value === 'number' && Number.isInteger(value))
}
