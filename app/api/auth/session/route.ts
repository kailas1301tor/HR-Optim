// app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAMES, SESSION_MAX_AGE_SECONDS } from '@/lib/cookies'

interface SessionBody {
  token?: string
  username?: string
  email?: string
  userId?: number | string
}

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
  let body: SessionBody
  try {
    body = (await request.json()) as SessionBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { token, username = '', email = '', userId } = body
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const parsedUserId =
    userId !== undefined && userId !== null && String(userId).trim() !== ''
      ? String(userId)
      : ''

  const response = NextResponse.json({ success: true })
  const options = getSessionCookieOptions()

  // Not httpOnly: client-side api wrapper reads this for Bearer Authorization
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
