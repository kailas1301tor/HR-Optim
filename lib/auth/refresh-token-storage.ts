// lib/auth/refresh-token-storage.ts

const STORAGE_KEY = 'hrms_refresh_token'
/** Default until backend confirms refresh token TTL */
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

interface StoredRefreshToken {
  token: string
  expiresAt: number
}

export function setRefreshToken(token: string, ttlMs: number = REFRESH_TOKEN_TTL_MS): void {
  if (typeof window === 'undefined' || !token.trim()) return
  const record: StoredRefreshToken = {
    token,
    expiresAt: Date.now() + ttlMs,
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StoredRefreshToken
    if (!parsed.token || Date.now() > parsed.expiresAt) {
      clearRefreshToken()
      return null
    }
    return parsed.token
  } catch {
    clearRefreshToken()
    return null
  }
}

export function clearRefreshToken(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}
