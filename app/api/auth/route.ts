import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, isAuthorized, passwordMatches } from '@/lib/server-auth'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

const LOGIN_RULE = { prefix: 'auth', limit: 5, window: '15 m' } as const

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

/** ¿Hay sesión abierta? El dashboard lo consulta al cargar. */
export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAuthorized(req) })
}

/** Login: comprueba la contraseña y abre una sesión con cookie httpOnly. */
export async function POST(req: NextRequest) {
  if (!await checkRateLimit(clientIp(req), LOGIN_RULE)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  const { password } = await req.json().catch(() => ({ password: null }))
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, createSessionToken(), { ...cookieOptions, maxAge: SESSION_MAX_AGE })
  return res
}

/** Logout: borra la cookie de sesión. */
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 })
  return res
}
