// components/layout/app-shell-route-guard.tsx
'use client'

import { usePathname } from 'next/navigation'
import { CommonErrorState, CommonPageSkeleton } from '@/components/common'
import { usePermissions } from '@/components/auth/permissions-provider'
import { moduleKeyFromPathname } from '@/lib/permissions/module-permissions'

interface AppShellRouteGuardProps {
  children: React.ReactNode
}

export function AppShellRouteGuard({ children }: AppShellRouteGuardProps) {
  const pathname = usePathname()
  const { isLoading, accessLevel } = usePermissions()
  const moduleKey = moduleKeyFromPathname(pathname)

  if (isLoading) {
    return <CommonPageSkeleton />
  }

  if (accessLevel(moduleKey) === 'none') {
    return (
      <CommonErrorState
        title="Access denied"
        message="You do not have permission to view this page. Contact your administrator if you believe this is an error."
      />
    )
  }

  return <>{children}</>
}
