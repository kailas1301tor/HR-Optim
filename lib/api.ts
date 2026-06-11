import { toast } from 'sonner'
import { AUTH_COOKIE_NAMES, getClientCookie } from '@/lib/cookies'
import { resolveRequestUrl } from '@/lib/env'
import { parseAuthErrorPayload } from '@/lib/helpers/parse-auth-form-errors'
import { attemptSilentReauth } from '@/lib/auth/silent-reauth'
import { clearRefreshToken } from '@/lib/auth/refresh-token-storage'

let isRedirectingToLogin = false

async function handleUnauthorized(): Promise<void> {
  if (typeof window === 'undefined' || isRedirectingToLogin) return

  const refreshed = await attemptSilentReauth()
  if (refreshed) return

  isRedirectingToLogin = true
  toast.error('Your session has expired. Please sign in again.')
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch {
    // Best-effort session clear before redirect
  }
  clearRefreshToken()
  window.location.href = '/login'
}

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
  /** Do not attach stored session token (e.g. login). */
  skipAuthHeader?: boolean
  /** Do not hard-redirect to /login on 401 (e.g. failed login attempt). */
  skipSessionRedirect?: boolean
  /** Internal: prevents infinite retry after silent reauth. */
  isRetryAfterRefresh?: boolean
}

function resolveErrorMessage(responseData: unknown, status: number, fallback: string): string {
  const parsed = parseAuthErrorPayload(responseData)
  if (parsed.length > 0) return parsed.join('. ')

  const errBody = responseData as Record<string, unknown> | undefined
  return (
    (typeof errBody?.message === 'string' ? errBody.message : undefined) ??
    (typeof errBody?.error === 'string' ? errBody.error : undefined) ??
    (fallback || `Request failed with status ${status}`)
  )
}

function buildRequestUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  return resolveRequestUrl(endpoint, params)
}

function wrapNetworkError(error: unknown): Error {
  if (error instanceof ApiError) return error
  if (error instanceof Error && error.name === 'AbortError') return error
  if (error instanceof TypeError) {
    return new ApiError(
      'Unable to reach the server. Please check your connection and try again.',
      0,
      error,
    )
  }
  return error instanceof Error ? error : new ApiError('Request failed')
}

function buildAuthHeaders(
  options: RequestOptions,
  body?: Record<string, unknown> | object | FormData | string | null,
): { headers: Headers; sessionToken: string | null } {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const sessionToken = options.skipAuthHeader ? null : getClientCookie(AUTH_COOKIE_NAMES.session)
  if (sessionToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${sessionToken}`)
  }

  return { headers, sessionToken }
}

export interface BlobResponse {
  blob: Blob
  contentDisposition: string | null
}

async function requestBlob(
  endpoint: string,
  options: RequestOptions = {},
): Promise<BlobResponse> {
  const url = buildRequestUrl(endpoint, options.params)
  const { headers, sessionToken } = buildAuthHeaders(options)

  const response = await fetch(url, {
    ...options,
    method: 'GET',
    headers,
  })

  if (response.status === 401) {
    const hadActiveSession = Boolean(sessionToken)
    const shouldRedirect = hadActiveSession && !options.skipSessionRedirect

    if (shouldRedirect && !options.isRetryAfterRefresh) {
      const refreshed = await attemptSilentReauth()
      if (refreshed) {
        return requestBlob(endpoint, { ...options, isRetryAfterRefresh: true })
      }
      await handleUnauthorized()
    }

    let responseData: unknown
    try {
      responseData = await response.json()
    } catch {
      responseData = undefined
    }

    throw new ApiError(
      resolveErrorMessage(
        responseData,
        401,
        hadActiveSession ? 'Session expired. Please sign in again.' : 'Unauthorized.',
      ),
      401,
      responseData,
    )
  }

  if (!response.ok) {
    let responseData: unknown
    const contentType = response.headers.get('Content-Type')
    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    throw new ApiError(
      resolveErrorMessage(responseData, response.status, `Request failed with status ${response.status}`),
      response.status,
      responseData,
    )
  }

  const blob = await response.blob()
  return {
    blob,
    contentDisposition: response.headers.get('Content-Disposition'),
  }
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: Record<string, unknown> | object | FormData | string | null,
  options: RequestOptions = {}
): Promise<T> {
  const url = buildRequestUrl(endpoint, options.params)
  const { headers, sessionToken } = buildAuthHeaders(options, body)

  const config: RequestInit = {
    ...options,
    method,
    headers,
  }

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body)
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 204) {
      return undefined as T
    }

    let responseData: unknown
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json() as unknown
    } else {
      responseData = await response.text()
    }

    if (response.status === 401) {
      const hadActiveSession = Boolean(sessionToken)
      const shouldRedirect = hadActiveSession && !options.skipSessionRedirect

      if (shouldRedirect && !options.isRetryAfterRefresh) {
        const refreshed = await attemptSilentReauth()
        if (refreshed) {
          return request<T>(method, endpoint, body, { ...options, isRetryAfterRefresh: true })
        }
        await handleUnauthorized()
      }

      throw new ApiError(
        resolveErrorMessage(
          responseData,
          401,
          hadActiveSession ? 'Session expired. Please sign in again.' : 'Invalid username or password.'
        ),
        401,
        responseData
      )
    }

    if (!response.ok) {
      throw new ApiError(
        resolveErrorMessage(responseData, response.status, `Request failed with status ${response.status}`),
        response.status,
        responseData
      )
    }

    return responseData as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    const wrapped = wrapNetworkError(error)
    console.error(`🔴 API Request Error [${method} ${url}]:`, wrapped)
    throw wrapped
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, undefined, options),

  getBlob: (endpoint: string, options?: RequestOptions) =>
    requestBlob(endpoint, options),

  post: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('POST', endpoint, body, options),

  put: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('PUT', endpoint, body, options),

  patch: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('PATCH', endpoint, body, options),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, undefined, options),
}
