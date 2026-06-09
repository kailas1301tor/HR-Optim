// proxy.ts — Next.js 16 route guard (replaces middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAMES } from '@/lib/cookies'

const PUBLIC_PATHS = new Set(['/login'])

export function proxy(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAMES.session)?.value
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'

  if (!session && !isLoginPage && !PUBLIC_PATHS.has(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    if (pathname !== '/') {
      url.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(url)
  }

  if (session && isLoginPage) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
    const url = request.nextUrl.clone()
    url.pathname = redirectTo.startsWith('/') ? redirectTo : '/'
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
