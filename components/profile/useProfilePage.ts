// components/profile/useProfilePage.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  invalidatePermissions,
  loadCachedUserProfile,
  usePermissions,
} from '@/components/auth/permissions-provider'
import { loadProfileEmployeeDetail } from '@/lib/helpers/load-profile-employee-detail'
import type { CurrentUserProfile } from '@/types/auth'
import type { Employee } from '@/types/employee'

export type ProfilePageStatus = 'loading' | 'error' | 'loaded'

export interface UseProfilePageReturn {
  status: ProfilePageStatus
  authProfile: CurrentUserProfile | null
  employeeDetail: Employee | null
  errorMessage: string | null
  handleRetry: () => void
}

export function useProfilePage(): UseProfilePageReturn {
  const { permissions, isLoading: isPermissionsLoading } = usePermissions()
  const [status, setStatus] = useState<ProfilePageStatus>('loading')
  const [authProfile, setAuthProfile] = useState<CurrentUserProfile | null>(null)
  const [employeeDetail, setEmployeeDetail] = useState<Employee | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const handleRetry = useCallback((): void => {
    invalidatePermissions()
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    if (isPermissionsLoading) return

    const controller = new AbortController()
    let active = true

    async function loadProfile(): Promise<void> {
      setStatus('loading')
      setErrorMessage(null)
      setEmployeeDetail(null)

      try {
        const profile = await loadCachedUserProfile()
        if (!active) return

        setAuthProfile(profile)

        if (profile.employee_profile_id) {
          const employee = await loadProfileEmployeeDetail(
            profile.employee_profile_id,
            permissions,
            controller.signal,
          )
          if (active) {
            setEmployeeDetail(employee)
          }
        }

        if (active) {
          setStatus('loaded')
        }
      } catch (err: unknown) {
        if (!active) return
        if (err instanceof Error && err.name === 'AbortError') return

        setAuthProfile(null)
        setEmployeeDetail(null)
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load your profile',
        )
        setStatus('error')
      }
    }

    void loadProfile()

    return () => {
      active = false
      controller.abort()
    }
  }, [reloadToken, isPermissionsLoading, permissions])

  return {
    status: status === 'loaded' && isPermissionsLoading ? 'loading' : status,
    authProfile,
    employeeDetail,
    errorMessage,
    handleRetry,
  }
}
