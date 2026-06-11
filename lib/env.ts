// lib/env.ts
/** Stage default — used only when NEXT_PUBLIC_API_URL is unset in local development. */
const STAGE_API_BASE_URL = 'https://roka-stage-backend.hroptim.com'

/** Same-origin prefix; Next.js rewrites this to the backend (avoids browser CORS). */
export const CLIENT_API_PROXY_PREFIX = '/api/hrms'

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '')
}

/**
 * Django APPEND_SLASH: backend API paths must end with `/` before any query string.
 */
export function ensureApiTrailingSlash(endpoint: string): string {
  const withLeading = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const qIndex = withLeading.indexOf('?')
  const pathname = qIndex === -1 ? withLeading : withLeading.slice(0, qIndex)
  const query = qIndex === -1 ? '' : withLeading.slice(qIndex)

  if (!pathname.startsWith('/api/')) return withLeading
  if (pathname.endsWith('/')) return withLeading

  return `${pathname}/${query}`
}

export function resolveBackendOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL

  if (configured && configured.trim() !== '') {
    return normalizeBaseUrl(configured)
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_API_URL is required in production. Set it in your deployment environment before building.'
    )
  }

  return STAGE_API_BASE_URL
}

function resolveApiBaseUrl(): string {
  const origin = resolveBackendOrigin()

  if (
    typeof window !== 'undefined' &&
    !(process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '')
  ) {
    console.warn(
      '[env] NEXT_PUBLIC_API_URL is not set. Using stage backend for local development:',
      origin
    )
  }

  return origin
}

/** Direct backend origin (server / build). Browser requests use the proxy prefix instead. */
export const API_BASE_URL = resolveApiBaseUrl()

/** Build a full backend URL from a path or endpoint segment. */
export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${ensureApiTrailingSlash(path)}`
}

/**
 * Resolve the URL used by the shared API client.
 * Browser: same-origin `/api/hrms/*` (rewritten to backend).
 * Server: direct backend origin.
 */
export function resolveRequestUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  const cleanEndpoint = ensureApiTrailingSlash(endpoint)

  let url: string
  if (typeof window !== 'undefined') {
    const pathAfterApi = cleanEndpoint.startsWith('/api/')
      ? cleanEndpoint.slice(4)
      : cleanEndpoint
    url = `${CLIENT_API_PROXY_PREFIX}${pathAfterApi}`
  } else {
    url = `${API_BASE_URL}${cleanEndpoint}`
  }

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      searchParams.append(key, String(val))
    })
    url += `?${searchParams.toString()}`
  }

  return url
}
