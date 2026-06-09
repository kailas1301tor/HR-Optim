// lib/cookies.ts

export const AUTH_COOKIE_NAMES = {
  session: 'auth_session',
  username: 'auth_username',
  email: 'auth_email',
  userId: 'auth_user_id',
} as const

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

export function getClientCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function formatDisplayNameFromUsername(username: string): string {
  const nameParts = username.split(/[._@]/).filter(Boolean)
  if (nameParts.length === 0) return 'User'
  return nameParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function initialsFromName(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
