// components/layout/app-shell-route-guard.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CommonErrorState, ModuleRestrictedState } from '@/components/common'
import { usePermissions } from '@/components/auth/permissions-provider'
import { getDefaultPostLoginPath } from '@/lib/permissions/get-default-post-login-path'
import {
  canAccessPathname,
  isPathAlwaysAllowed,
  moduleKeyFromPathname,
} from '@/lib/permissions/module-permissions'

interface AppShellRouteGuardProps {
  children: React.ReactNode
}

export function AppShellRouteGuard({ children }: AppShellRouteGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    isLoading,
    hasError,
    permissions,
    hasAnyModuleAccess,
    reloadPermissions,
  } = usePermissions()

  const isAlwaysAllowed = isPathAlwaysAllowed(pathname)
  const canAccess = canAccessPathname(permissions, pathname)
  const moduleKey = moduleKeyFromPathname(pathname)

  useEffect(() => {
    if (isLoading || hasError) return
    if (pathname !== '/') return

    const hasDashboardAccess = canAccessPathname(permissions, '/')
    if (hasDashboardAccess) return

    if (!hasAnyModuleAccess) {
      router.replace('/profile')
      return
    }

    router.replace(getDefaultPostLoginPath(permissions))
  }, [isLoading, hasError, pathname, permissions, hasAnyModuleAccess, router])

  if (hasError) {
    return (
      <CommonErrorState
        title="Could not load permissions"
        message="We couldn't load your access permissions. Check your connection and try again."
        onRetry={reloadPermissions}
      />
    )
  }

  if (!isLoading && !isAlwaysAllowed && !canAccess) {
    return <ModuleRestrictedState moduleKey={moduleKey} />
  }

  return <>{children}</>
}
