// components/profile/useProfilePage.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  invalidatePermissions,
  loadCachedUserProfile,
} from '@/components/auth/permissions-provider'
import type { CurrentUserProfile } from '@/types/auth'

export type ProfilePageStatus = 'loading' | 'error' | 'loaded'

export interface UseProfilePageReturn {
  status: ProfilePageStatus
  authProfile: CurrentUserProfile | null
  errorMessage: string | null
  handleRetry: () => void
}

export function useProfilePage(): UseProfilePageReturn {
  const [status, setStatus] = useState<ProfilePageStatus>('loading')
  const [authProfile, setAuthProfile] = useState<CurrentUserProfile | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const handleRetry = useCallback((): void => {
    invalidatePermissions()
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    let active = true

    async function loadProfile(): Promise<void> {
      setStatus('loading')
      setErrorMessage(null)

      try {
        const profile = await loadCachedUserProfile()
        if (!active) return

        setAuthProfile(profile)
        setStatus('loaded')
      } catch (err: unknown) {
        if (!active) return

        setAuthProfile(null)
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load your profile',
        )
        setStatus('error')
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [reloadToken])

  return {
    status,
    authProfile,
    errorMessage,
    handleRetry,
  }
}
