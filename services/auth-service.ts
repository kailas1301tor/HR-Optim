// services/auth-service.ts
import { api, ApiError } from '@/lib/api'
import {
  AUTH_COOKIE_NAMES,
  clearAuthCookies,
  getClientCookie,
  setAuthSessionCookies,
} from '@/lib/cookies'
import { clearRefreshToken, getRefreshToken, setRefreshToken } from '@/lib/auth/refresh-token-storage'
import { clearPendingAuth } from '@/lib/helpers/pending-auth-storage'
import type {
  CurrentUserProfile,
  CurrentUserProfileResponse,
  CurrentUserProfileWire,
  LoginResponse,
  ProfileField,
  RefreshTokenApiContract,
  RefreshTokenResponse,
  RefreshTokenResult,
} from '@/types/auth'
export type { LoginResponse } from '@/types/auth'

const REFRESH_ENDPOINT: RefreshTokenApiContract['endpoint'] = '/api/auth/token/refresh/'

function isProfileField<T>(field: unknown): field is ProfileField<T> {
  return (
    typeof field === 'object' &&
    field !== null &&
    'value' in field &&
    'is_editable' in field
  )
}

function unwrapField<T>(field: T | ProfileField<T> | undefined | null): T | undefined {
  if (field === undefined || field === null) return undefined
  if (isProfileField<T>(field)) return field.value
  return field
}

function normalizeCurrentUserProfile(data: CurrentUserProfileWire): CurrentUserProfile {
  return {
    id: unwrapField(data.id) ?? 0,
    username: unwrapField(data.username) ?? '',
    email: unwrapField(data.email) ?? '',
    permissions: unwrapField(data.permissions) ?? [],
    employee_profile_id: unwrapField(data.employee_profile_id) ?? null,
  }
}

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

  persistSession(
    token: string,
    username: string,
    email: string,
    userId?: number
  ): void {
    setAuthSessionCookies({ token, username, email, userId })
  },

  persistSessionFromCookies(accessToken: string): void {
    const username = getClientCookie(AUTH_COOKIE_NAMES.username) ?? ''
    const email = getClientCookie(AUTH_COOKIE_NAMES.email) ?? ''
    const rawUserId = getClientCookie(AUTH_COOKIE_NAMES.userId)
    const parsedUserId = rawUserId ? Number(rawUserId) : undefined
    setAuthSessionCookies({
      token: accessToken,
      username,
      email,
      userId: parsedUserId && Number.isFinite(parsedUserId) ? parsedUserId : undefined,
    })
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

  async getCurrentUserProfile(): Promise<CurrentUserProfile> {
    const response = await api.get<CurrentUserProfileResponse>('/api/auth/profile/')
    const data = response.results?.data
    if (!data) {
      throw new ApiError('Failed to load user profile', 500, response)
    }
    return normalizeCurrentUserProfile(data)
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
    clearAuthCookies()
    clearRefreshToken()
    clearPendingAuth()
    window.location.href = '/login'
  },
}
