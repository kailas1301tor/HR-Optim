// components/layout/useAppShell.ts
'use client'

import { useState, useEffect } from 'react'
import {
  AUTH_COOKIE_NAMES,
  formatDisplayNameFromUsername,
  getClientCookie,
  initialsFromName,
} from '@/lib/cookies'
import { formatPersonName } from '@/lib/helpers/format-display-text'
import { loadCachedUserProfile } from '@/components/auth/permissions-provider'
import type { UserProfile } from './app-shell'

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'User',
  email: '',
  roleName: 'Employee',
  initials: 'U',
}

function resolveDisplayName(
  profile: Awaited<ReturnType<typeof loadCachedUserProfile>>,
  inferredName: string,
): string {
  return formatPersonName(
    profile.fullName ||
      formatDisplayNameFromUsername(profile.username) ||
      profile.email ||
      inferredName,
  )
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
        const profile = await loadCachedUserProfile()
        if (controller.signal.aborted) return

        const profileName = resolveDisplayName(profile, inferredName)

        setUserProfile({
          fullName: profileName,
          email: profile.email || email,
          roleName: profile.designation || DEFAULT_PROFILE.roleName,
          initials: initialsFromName(profileName),
        })
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.warn('🔴 Network error fetching user profile detail:', err)
      }
    }

    void loadProfile()

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
