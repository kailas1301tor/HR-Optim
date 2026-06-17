// lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AUTH_COOKIE_NAMES, clearAuthCookies, getClientCookie } from '@/lib/cookies'
import { parseAuthErrorPayload } from '@/lib/helpers/parse-auth-form-errors'

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

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuthHeader?: boolean
  skipSessionRedirect?: boolean
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach bearer token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const apiConfig = config as ApiRequestConfig
    if (typeof window !== 'undefined' && !apiConfig.skipAuthHeader) {
      const token = getClientCookie(AUTH_COOKIE_NAMES.session)
      if (token && config.headers && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Unwrap data directly and handle 401 redirection
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') {
      return response
    }
    return response.data
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const data = error.response?.data
      const apiConfig = error.config as ApiRequestConfig | undefined

      if (status === 401 && !apiConfig?.skipSessionRedirect) {
        if (typeof window !== 'undefined') {
          clearAuthCookies()
          window.location.href = '/login'
        }
      }

      // Resolve user-friendly error message
      let message = 'Request failed'
      if (data && typeof data === 'object') {
        const parsed = parseAuthErrorPayload(data)
        if (parsed.length > 0) {
          message = parsed.join('. ')
        } else {
          const errBody = data as Record<string, unknown>
          message =
            (typeof errBody.message === 'string' ? errBody.message : undefined) ??
            (typeof errBody.error === 'string' ? errBody.error : undefined) ??
            `Request failed with status ${status}`
        }
      } else {
        message = error.message || message
      }

      return Promise.reject(new ApiError(message, status, data))
    }

    return Promise.reject(error)
  }
)

export interface SimpleApiClient {
  get<T = any>(url: string, config?: ApiRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: ApiRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<T>
  getBlob(url: string, config?: ApiRequestConfig): Promise<{ blob: Blob; contentDisposition: string | null }>
}

export const api: SimpleApiClient = {
  get: (url, config) => axiosInstance.get(url, config),
  delete: (url, config) => axiosInstance.delete(url, config),
  post: (url, data, config) => axiosInstance.post(url, data, config),
  put: (url, data, config) => axiosInstance.put(url, data, config),
  patch: (url, data, config) => axiosInstance.patch(url, data, config),
  getBlob: async (url, config) => {
    const response = (await axiosInstance.get<Blob>(url, {
      ...config,
      responseType: 'blob',
    })) as unknown as AxiosResponse<Blob>
    return {
      blob: response.data,
      contentDisposition: response.headers['content-disposition'] || null,
    }
  },
}
