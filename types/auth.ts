// types/auth.ts

/** Session data held during first-login set-password flow (before cookies are set). */
export interface PendingAuthSession {
  token: string
  refresh?: string
  username: string
  email: string
  userId: number
  expiresAt: number
}

/** Payload sent to POST /api/auth/session */
export interface PersistSessionInput {
  token: string
  username: string
  email: string
  userId?: number
}

/** Result from a successful token refresh (future backend API). */
export interface RefreshTokenResult {
  access: string
  refresh?: string
}

/**
 * Placeholder contract — update when backend delivers the refresh endpoint.
 * @see auth-refresh-api-wire todo in module plan
 */
export interface RefreshTokenApiContract {
  endpoint: '/api/auth/token/refresh/'
  method: 'POST'
  body: { refresh: string }
}

export interface LoginResponse {
  message: string
  results: {
    data: {
      refresh: string
      access: string
      user_id: number
      username: string
      email: string
      has_password_changed: boolean
    }
  }
}

export interface RefreshTokenResponse {
  message: string
  results: {
    data: {
      access: string
      refresh?: string
    }
  }
}
