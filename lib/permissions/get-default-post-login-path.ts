// lib/permissions/get-default-post-login-path.ts
import {
  canViewModule,
  canAccessPathname,
  resolveModuleFromPath,
  type ModuleKey,
} from '@/lib/permissions/module-permissions'
import { SIDEBAR_NAV_ITEMS } from '@/components/layout/sidebar-nav-config'

export function getDefaultPostLoginPath(permissions: Set<string>): string {
  return '/'
}

export function getModuleKeyForPath(pathname: string): ModuleKey | null {
  return resolveModuleFromPath(pathname)
}

export function canAccessPath(permissions: Set<string>, pathname: string): boolean {
  return canAccessPathname(permissions, pathname)
}
