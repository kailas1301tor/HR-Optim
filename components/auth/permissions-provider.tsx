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
  hasAnyModuleAccess as checkHasAnyModuleAccess,
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
  employeeProfileId: number | null
  fullName: string | null
  designation: string | null
  isManualAttendanceEnabled: boolean
  isPunchIn: boolean
  hasAnyModuleAccess: boolean
  isEmployeeOnly: boolean
  reloadPermissions: () => void
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
  const [employeeProfileId, setEmployeeProfileId] = useState<number | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [designation, setDesignation] = useState<string | null>(null)
  const [isManualAttendanceEnabled, setIsManualAttendanceEnabled] = useState(false)
  const [isPunchIn, setIsPunchIn] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const reloadPermissions = useCallback(() => {
    invalidatePermissions()
    setReloadToken((token) => token + 1)
  }, [])

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
        setEmployeeProfileId(profile.employee_profile_id ?? null)
        setFullName(profile.fullName ?? null)
        setDesignation(profile.designation ?? null)
        setIsManualAttendanceEnabled(profile.isManualAttendanceEnabled)
        setIsPunchIn(profile.isPunchIn)
      } catch {
        if (!active) return
        setHasError(true)
        setPermissions(new Set())
        setEmployeeProfileId(null)
        setFullName(null)
        setDesignation(null)
        setIsManualAttendanceEnabled(false)
        setIsPunchIn(false)
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
  }, [reloadToken])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleRestore = () => {
      reloadPermissions()
    }

    window.addEventListener('hrms:network-restored', handleRestore)
    return () => {
      window.removeEventListener('hrms:network-restored', handleRestore)
    }
  }, [reloadPermissions])

  const hasAnyModuleAccess = useMemo(
    () => checkHasAnyModuleAccess(permissions),
    [permissions],
  )

  const isEmployeeOnly = useMemo(
    () => !isLoading && !hasError && !hasAnyModuleAccess && employeeProfileId !== null,
    [isLoading, hasError, hasAnyModuleAccess, employeeProfileId],
  )

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
      employeeProfileId,
      fullName,
      designation,
      isManualAttendanceEnabled,
      isPunchIn,
      hasAnyModuleAccess,
      isEmployeeOnly,
      reloadPermissions,
      hasPermission,
      canView,
      canManage,
      accessLevel,
    }),
    [
      isLoading,
      hasError,
      permissions,
      employeeProfileId,
      fullName,
      designation,
      isManualAttendanceEnabled,
      isPunchIn,
      hasAnyModuleAccess,
      isEmployeeOnly,
      reloadPermissions,
      hasPermission,
      canView,
      canManage,
      accessLevel,
    ],
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
