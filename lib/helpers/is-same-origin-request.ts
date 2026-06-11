// lib/helpers/is-same-origin-request.ts
import type { NextRequest } from 'next/server'

/** Rejects cross-origin session cookie writes. */
export function isSameOriginRequest(request: NextRequest): boolean {
  const host = request.nextUrl.host
  const origin = request.headers.get('origin')

  if (origin) {
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).host === host
    } catch {
      return false
    }
  }

  return false
}
