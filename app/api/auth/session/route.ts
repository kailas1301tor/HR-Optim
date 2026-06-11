// app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAMES, SESSION_MAX_AGE_SECONDS } from '@/lib/cookies'
import { isJwtShaped } from '@/lib/helpers/jwt-decode-exp'
import { isSameOriginRequest } from '@/lib/helpers/is-same-origin-request'
import type { PersistSessionInput } from '@/types/auth'

function getSessionCookieOptions(): {
  path: string
  maxAge: number
  sameSite: 'lax'
  secure: boolean
} {
  return {
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}

function clearAuthCookies(response: NextResponse): void {
  const clearOptions = { path: '/', maxAge: 0 }
  response.cookies.set(AUTH_COOKIE_NAMES.session, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.username, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.email, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.userId, '', clearOptions)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: PersistSessionInput
  try {
    body = (await request.json()) as PersistSessionInput
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, username = '', email = '', userId } = body
  if (!token || typeof token !== 'string' || !isJwtShaped(token)) {
    return NextResponse.json({ error: 'Valid token is required' }, { status: 400 })
  }

  const parsedUserId =
    userId !== undefined && userId !== null && String(userId).trim() !== ''
      ? String(userId)
      : ''

  const response = NextResponse.json({ success: true })
  const options = getSessionCookieOptions()

  // SECURITY: Not httpOnly — client api wrapper reads this for Bearer Authorization.
  // Long-term: migrate to httpOnly BFF proxy (see module-by-module auth plan).
  response.cookies.set(AUTH_COOKIE_NAMES.session, token, options)
  response.cookies.set(AUTH_COOKIE_NAMES.username, username, options)
  response.cookies.set(AUTH_COOKIE_NAMES.email, email, options)
  if (parsedUserId) {
    response.cookies.set(AUTH_COOKIE_NAMES.userId, parsedUserId, options)
  }

  return response
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  clearAuthCookies(response)
  return response
}
