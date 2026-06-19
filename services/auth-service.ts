// services/auth-service.ts
import { api, ApiError } from '@/lib/api'
import {
  AUTH_COOKIE_NAMES,
  clearAuthCookies,
  getClientCookie,
  setAuthSessionCookies,
} from '@/lib/cookies'
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
    fullName: unwrapField(data.full_name)?.trim() ?? '',
    designation: unwrapField(data.designation)?.trim() ?? '',
    username: unwrapField(data.username) ?? '',
    email: unwrapField(data.email) ?? '',
    permissions: unwrapField(data.permissions) ?? [],
    employee_profile_id: unwrapField(data.employee_profile_id) ?? null,
    isManualAttendanceEnabled: Boolean(unwrapField(data.is_manual_attendance_enabled)),
    isPunchIn: Boolean(unwrapField(data.is_punch_in)),
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

  async logout(): Promise<void> {
    clearAuthCookies()
    clearPendingAuth()
    window.location.href = '/login'
  },
}
