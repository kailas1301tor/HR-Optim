// services/auth-service.ts
import { api, ApiError } from '@/lib/api'
import { AUTH_COOKIE_NAMES, getClientCookie } from '@/lib/cookies'
import { clearRefreshToken, getRefreshToken, setRefreshToken } from '@/lib/auth/refresh-token-storage'
import { clearPendingAuth } from '@/lib/helpers/pending-auth-storage'
import type {
  LoginResponse,
  PersistSessionInput,
  RefreshTokenApiContract,
  RefreshTokenResponse,
  RefreshTokenResult,
} from '@/types/auth'
export type { LoginResponse } from '@/types/auth'

const REFRESH_ENDPOINT: RefreshTokenApiContract['endpoint'] = '/api/auth/token/refresh/'

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    return await api.post<LoginResponse>(
      '/api/auth/login/',
      { username, password },
      { skipAuthHeader: true, skipSessionRedirect: true }
    )
  },

  async setPassword(password: string, confirmPassword: string, token?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return await api.post<{ message: string }>(
      '/api/employee/set-password/',
      {
        new_password: password,
        confirm_new_password: confirmPassword,
      },
      { headers, skipAuthHeader: true, skipSessionRedirect: true }
    )
  },

  async persistSession(
    token: string,
    username: string,
    email: string,
    userId?: number
  ): Promise<void> {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username, email, userId } satisfies PersistSessionInput),
    })

    if (!response.ok) {
      let responseData: unknown
      try {
        responseData = await response.json()
      } catch {
        responseData = undefined
      }
      throw new ApiError('Failed to persist session', response.status, responseData)
    }
  },

  async persistSessionFromCookies(accessToken: string): Promise<void> {
    const username = getClientCookie(AUTH_COOKIE_NAMES.username) ?? ''
    const email = getClientCookie(AUTH_COOKIE_NAMES.email) ?? ''
    const rawUserId = getClientCookie(AUTH_COOKIE_NAMES.userId)
    const userId = rawUserId ? Number(rawUserId) : undefined
    await authService.persistSession(accessToken, username, email, userId)
  },

  storeTokensFromLogin(access: string, refresh?: string): void {
    if (refresh) {
      setRefreshToken(refresh)
    }
  },

  /**
   * Renews access token via backend refresh endpoint.
   * Returns null when no refresh token is stored or the API rejects the request.
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    return await api.post<{ message: string }>('/api/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    })
  },

  async refreshAccessToken(): Promise<RefreshTokenResult | null> {
    const refresh = getRefreshToken()
    if (!refresh) return null

    try {
      const response = await api.post<RefreshTokenResponse>(
        REFRESH_ENDPOINT,
        { refresh } satisfies RefreshTokenApiContract['body'],
        { skipAuthHeader: true, skipSessionRedirect: true }
      )
      const data = response.results?.data
      if (!data?.access) return null
      return { access: data.access, refresh: data.refresh }
    } catch {
      return null
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {
      // Proceed with redirect even if session clear fails
    }
    clearRefreshToken()
    clearPendingAuth()
    window.location.href = '/login'
  },
}
