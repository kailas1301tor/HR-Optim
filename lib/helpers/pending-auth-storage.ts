// lib/helpers/pending-auth-storage.ts
import type { PendingAuthSession } from '@/types/auth'

const STORAGE_KEY = 'hrms_pending_auth'
const TTL_MS = 10 * 60 * 1000

export function setPendingAuth(session: Omit<PendingAuthSession, 'expiresAt'>): void {
  if (typeof window === 'undefined') return
  const record: PendingAuthSession = { ...session, expiresAt: Date.now() + TTL_MS }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

export function getPendingAuth(): PendingAuthSession | null {
  if (typeof window === 'undefined') return null
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PendingAuthSession
    if (!parsed.token || Date.now() > parsed.expiresAt) {
      clearPendingAuth()
      return null
    }
    return parsed
  } catch {
    clearPendingAuth()
    return null
  }
}

export function clearPendingAuth(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}
