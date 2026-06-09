// components/layout/useAppShell.ts
'use client'

import { useState, useEffect } from 'react'
import {
  AUTH_COOKIE_NAMES,
  formatDisplayNameFromUsername,
  getClientCookie,
  initialsFromName,
} from '@/lib/cookies'
import { resolveCurrentEmployeeRecord } from '@/lib/helpers/resolve-current-employee'
import type { UserProfile } from './app-shell'

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'User',
  email: '',
  roleName: 'Employee',
  initials: 'U',
}

export interface UseAppShellReturn {
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  userProfile: UserProfile
}

export function useAppShell(): UseAppShellReturn {
  const [searchOpen, setSearchOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE)

  useEffect(() => {
    const email = getClientCookie(AUTH_COOKIE_NAMES.email) || ''
    const username = getClientCookie(AUTH_COOKIE_NAMES.username) || ''
    const inferredName = username ? formatDisplayNameFromUsername(username) : DEFAULT_PROFILE.fullName

    const initialProfile: UserProfile = {
      fullName: inferredName,
      email,
      roleName: DEFAULT_PROFILE.roleName,
      initials: initialsFromName(inferredName),
    }

    setUserProfile(initialProfile)

    const controller = new AbortController()

    async function loadProfile(): Promise<void> {
      try {
        const profileSource = await resolveCurrentEmployeeRecord(controller.signal)
        if (!profileSource || controller.signal.aborted) return

        setUserProfile({
          fullName: profileSource.full_name,
          email: profileSource.user.email,
          roleName: profileSource.designation || profileSource.role_name || 'Employee',
          initials: initialsFromName(profileSource.full_name),
        })
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.warn('🔴 Network error fetching user profile detail:', err)
      }
    }

    loadProfile()

    return () => {
      controller.abort()
    }
  }, [])

  return {
    searchOpen,
    setSearchOpen,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    userProfile,
  }
}
