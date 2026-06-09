import { AUTH_COOKIE_NAMES, getClientCookie } from '@/lib/cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hrms-backend-s9pn.onrender.com'

let isRedirectingToLogin = false

async function handleUnauthorized(): Promise<void> {
  if (typeof window === 'undefined' || isRedirectingToLogin) return
  isRedirectingToLogin = true
  try {
    await fetch('/api/auth/session', { method: 'DELETE' })
  } catch {
    // Best-effort session clear before redirect
  }
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
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: Record<string, unknown> | object | FormData | string | null,
  options: RequestOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let url = `${BASE_URL}${cleanEndpoint}`

  if (options.params) {
    const searchParams = new URLSearchParams()
    Object.entries(options.params).forEach(([key, val]) => {
      searchParams.append(key, String(val))
    })
    url += `?${searchParams.toString()}`
  }

  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const sessionToken = getClientCookie(AUTH_COOKIE_NAMES.session)
  if (sessionToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${sessionToken}`)
  }

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
      await handleUnauthorized()
      throw new ApiError('Session expired. Please sign in again.', 401, responseData)
    }

    if (!response.ok) {
      const errBody = responseData as Record<string, unknown> | undefined
      const errorMessage =
        (typeof errBody?.message === 'string' ? errBody.message : undefined) ??
        (typeof errBody?.error === 'string' ? errBody.error : undefined) ??
        `Request failed with status ${response.status}`
      throw new ApiError(errorMessage, response.status, responseData)
    }

    return responseData as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    console.error(`🔴 API Request Error [${method} ${url}]:`, error)
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('GET', endpoint, undefined, options),

  post: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('POST', endpoint, body, options),

  put: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('PUT', endpoint, body, options),

  patch: <T>(endpoint: string, body?: Record<string, unknown> | object | FormData | string | null, options?: RequestOptions) =>
    request<T>('PATCH', endpoint, body, options),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>('DELETE', endpoint, undefined, options),
}
