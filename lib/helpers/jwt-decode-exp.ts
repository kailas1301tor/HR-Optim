// lib/helpers/jwt-decode-exp.ts

function decodeBase64Url(segment: string): string | null {
  try {
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    if (typeof atob === 'function') {
      return atob(padded)
    }
    return Buffer.from(padded, 'base64').toString('utf-8')
  } catch {
    return null
  }
}

/** Returns JWT `exp` claim as Unix ms, or null if missing/invalid. Does not verify signature. */
export function getJwtExpiryMs(token: string): number | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const payloadJson = decodeBase64Url(parts[1])
  if (!payloadJson) return null

  try {
    const payload = JSON.parse(payloadJson) as { exp?: unknown }
    if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return null
    return payload.exp * 1000
  } catch {
    return null
  }
}

export function isJwtExpired(token: string, nowMs: number = Date.now()): boolean {
  const expMs = getJwtExpiryMs(token)
  if (expMs === null) return false
  return nowMs >= expMs
}

export function isJwtShaped(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every((part) => part.length > 0)
}
