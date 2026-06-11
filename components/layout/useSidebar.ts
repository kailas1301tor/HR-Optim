// components/layout/useSidebar.ts
import { useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/services/auth-service'
import { invalidatePermissions } from '@/components/auth/permissions-provider'

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface UseSidebarReturn {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  handleLogout: () => void
  breadcrumbs: BreadcrumbItem[]
  pathname: string
}

export function useSidebar(): UseSidebarReturn {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = useCallback((): void => {
    invalidatePermissions()
    authService.logout()
  }, [])

  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length === 0) return [{ label: 'Dashboard', href: '/' }]
    
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }))
  }, [pathname])

  const breadcrumbs = getBreadcrumbs()

  return {
    collapsed,
    setCollapsed,
    handleLogout,
    breadcrumbs,
    pathname,
  }
}
