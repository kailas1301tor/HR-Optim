// proxy.ts — Next.js 16 route guard (replaces middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAMES } from '@/lib/cookies'
import { getSafeRedirectPath } from '@/lib/helpers/get-safe-redirect-path'
import { isJwtExpired } from '@/lib/helpers/jwt-decode-exp'

const PUBLIC_PATHS = new Set(['/login'])

function clearSessionCookies(response: NextResponse): void {
  const clearOptions = { path: '/', maxAge: 0 }
  response.cookies.set(AUTH_COOKIE_NAMES.session, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.username, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.email, '', clearOptions)
  response.cookies.set(AUTH_COOKIE_NAMES.userId, '', clearOptions)
}

function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  if (pathname !== '/' && pathname !== '/login') {
    url.searchParams.set('redirect', pathname)
  }
  const response = NextResponse.redirect(url)
  clearSessionCookies(response)
  return response
}

export function proxy(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAMES.session)?.value
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'

  const isSessionExpired = session ? isJwtExpired(session) : false
  const hasValidSession = Boolean(session) && !isSessionExpired

  if (isSessionExpired) {
    if (!isLoginPage && !PUBLIC_PATHS.has(pathname)) {
      return redirectToLogin(request, pathname)
    }
    if (isLoginPage) {
      const response = NextResponse.next()
      clearSessionCookies(response)
      return response
    }
  }

  if (!hasValidSession && !isLoginPage && !PUBLIC_PATHS.has(pathname)) {
    return redirectToLogin(request, pathname)
  }

  if (hasValidSession && isLoginPage) {
    const redirectTo = getSafeRedirectPath(request.nextUrl.searchParams.get('redirect'))
    const url = request.nextUrl.clone()
    url.pathname = redirectTo
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|woff2?|css|js)).*)',
  ],
}
