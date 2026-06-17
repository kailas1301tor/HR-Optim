// lib/auth/silent-reauth.ts
import { authService } from '@/services/auth-service'
import { setRefreshToken } from '@/lib/auth/refresh-token-storage'

let refreshInFlight: Promise<boolean> | null = null

/**
 * Attempts silent session renewal via refresh token.
 * Returns true when a new access token was persisted (active once backend API is wired).
 */
export async function attemptSilentReauth(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const result = await authService.refreshAccessToken()
    if (!result?.access) return false

    await authService.persistSessionFromCookies(result.access)
    if (result.refresh) {
      setRefreshToken(result.refresh)
    }
    return true
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}
