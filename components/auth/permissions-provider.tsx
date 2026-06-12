// components/auth/permissions-provider.tsx
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/auth-service'
import { createModuleCache } from '@/lib/hooks/create-module-cache'
import {
  accessLevel as resolveAccessLevel,
  canManageModule,
  canViewModule,
  type ModuleAccessLevel,
  type ModuleKey,
} from '@/lib/permissions/module-permissions'
import type { CurrentUserProfile } from '@/types/auth'

const profileCache = createModuleCache<CurrentUserProfile>()

export function invalidatePermissions(): void {
  profileCache.invalidate()
}

export async function loadCachedUserProfile(): Promise<CurrentUserProfile> {
  return profileCache.fetch(() => authService.getCurrentUserProfile())
}

interface PermissionsContextValue {
  isLoading: boolean
  hasError: boolean
  permissions: Set<string>
  hasPermission: (codename: string) => boolean
  canView: (moduleKey: ModuleKey) => boolean
  canManage: (moduleKey: ModuleKey) => boolean
  accessLevel: (moduleKey: ModuleKey) => ModuleAccessLevel
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null)

interface PermissionsProviderProps {
  children: ReactNode
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [permissions, setPermissions] = useState<Set<string>>(new Set())

  useEffect(() => {
    let active = true

    async function loadPermissions(): Promise<void> {
      setIsLoading(true)
      setHasError(false)

      try {
        const profile = await profileCache.fetch(() => authService.getCurrentUserProfile())
        if (!active) return

        const codenames = new Set(
          profile.permissions.map((permission) => permission.codename).filter(Boolean),
        )
        setPermissions(codenames)
      } catch {
        if (!active) return
        setHasError(true)
        setPermissions(new Set())
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadPermissions()

    return () => {
      active = false
    }
  }, [])

  const hasPermission = useCallback(
    (codename: string) => permissions.has(codename),
    [permissions],
  )

  const canView = useCallback(
    (moduleKey: ModuleKey) => {
      if (isLoading) return false
      return canViewModule(permissions, moduleKey)
    },
    [isLoading, permissions],
  )

  const canManage = useCallback(
    (moduleKey: ModuleKey) => {
      if (isLoading) return false
      return canManageModule(permissions, moduleKey)
    },
    [isLoading, permissions],
  )

  const accessLevel = useCallback(
    (moduleKey: ModuleKey): ModuleAccessLevel => {
      if (isLoading) return 'none'
      return resolveAccessLevel(permissions, moduleKey)
    },
    [isLoading, permissions],
  )

  const value = useMemo<PermissionsContextValue>(
    () => ({
      isLoading,
      hasError,
      permissions,
      hasPermission,
      canView,
      canManage,
      accessLevel,
    }),
    [isLoading, hasError, permissions, hasPermission, canView, canManage, accessLevel],
  )

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>
}

export function usePermissions(): PermissionsContextValue {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}
