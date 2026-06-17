// lib/cookies.ts

import { formatPersonName } from '@/lib/helpers/format-display-text'

export const AUTH_COOKIE_NAMES = {
  session: 'auth_session',
  username: 'auth_username',
  email: 'auth_email',
  userId: 'auth_user_id',
} as const

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours

export interface AuthSessionCookieInput {
  token: string
  username: string
  email: string
  userId?: number
}

function setClientCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return

  const secure = window.location.protocol === 'https:'
  let cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
  if (secure) {
    cookie += '; secure'
  }
  document.cookie = cookie
}

function clearClientCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

/** Persist auth identity cookies in the browser after login or token refresh. */
export function setAuthSessionCookies({
  token,
  username,
  email,
  userId,
}: AuthSessionCookieInput): void {
  setClientCookie(AUTH_COOKIE_NAMES.session, token, SESSION_MAX_AGE_SECONDS)
  setClientCookie(AUTH_COOKIE_NAMES.username, username, SESSION_MAX_AGE_SECONDS)
  setClientCookie(AUTH_COOKIE_NAMES.email, email, SESSION_MAX_AGE_SECONDS)

  if (userId !== undefined && userId !== null && Number.isFinite(userId) && userId > 0) {
    setClientCookie(AUTH_COOKIE_NAMES.userId, String(userId), SESSION_MAX_AGE_SECONDS)
  }
}

/** Update only the access token cookie after silent refresh. */
export function setAuthSessionToken(token: string): void {
  setClientCookie(AUTH_COOKIE_NAMES.session, token, SESSION_MAX_AGE_SECONDS)
}

export function clearAuthCookies(): void {
  clearClientCookie(AUTH_COOKIE_NAMES.session)
  clearClientCookie(AUTH_COOKIE_NAMES.username)
  clearClientCookie(AUTH_COOKIE_NAMES.email)
  clearClientCookie(AUTH_COOKIE_NAMES.userId)
}

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
  return formatPersonName(nameParts.join(' '))
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
