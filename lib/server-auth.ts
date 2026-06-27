import { NextRequest } from 'next/server'

export function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return false
  const token = header.slice(7)
  const expected = process.env.DASHBOARD_PASSWORD
  return !!expected && token === expected
}
