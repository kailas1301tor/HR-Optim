// lib/permissions/module-permissions.ts

import { HELP_SUPPORT_LABEL } from '@/lib/support'
export type ModuleKey =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'documents'
  | 'assets'
  | 'requests'
  | 'tickets'
  | 'payroll'
  | 'reports'
  | 'settings'
  | 'onboarding'
  | 'offboarding'

export type ModuleAccessLevel = 'none' | 'view' | 'manage'

export interface ModulePermissionConfig {
  view: string
  manage?: string
}

export const MODULE_PERMISSIONS: Record<ModuleKey, ModulePermissionConfig> = {
  dashboard: { view: 'view_admin_dashboard' },
  employees: { view: 'view_employees', manage: 'manage_employees' },
  attendance: { view: 'view_attendance', manage: 'manage_attendance' },
  documents: { view: 'view_documents', manage: 'manage_documents' },
  assets: { view: 'view_assets', manage: 'manage_assets' },
  requests: { view: 'view_requests', manage: 'manage_requests' },
  tickets: { view: 'view_tickets', manage: 'manage_tickets' },
  payroll: { view: 'view_payroll', manage: 'manage_payroll' },
  reports: { view: 'view_reports', manage: 'manage_reports' },
  settings: { view: 'view_masters', manage: 'manage_masters' },
  onboarding: { view: 'view_onboarding', manage: 'manage_onboarding' },
  offboarding: { view: 'view_offboarding', manage: 'manage_offboarding' },
}

export function accessLevel(
  permissions: Set<string>,
  moduleKey: ModuleKey,
): ModuleAccessLevel {
  const config = MODULE_PERMISSIONS[moduleKey]
  if (config.manage && permissions.has(config.manage)) {
    return 'manage'
  }
  if (permissions.has(config.view)) {
    return 'view'
  }
  return 'none'
}

export function canViewModule(permissions: Set<string>, moduleKey: ModuleKey): boolean {
  return accessLevel(permissions, moduleKey) !== 'none'
}

export function canManageModule(permissions: Set<string>, moduleKey: ModuleKey): boolean {
  return accessLevel(permissions, moduleKey) === 'manage'
}

export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  attendance: 'Attendance',
  documents: 'Documents',
  assets: 'Assets',
  requests: 'Requests',
  tickets: HELP_SUPPORT_LABEL,
  payroll: 'Payroll',
  reports: 'Reports',
  settings: 'Settings',
  onboarding: 'Onboarding',
  offboarding: 'Offboarding',
}

export const NAV_MODULE_KEYS: ModuleKey[] = [
  'dashboard',
  'employees',
  'attendance',
  'documents',
  'assets',
  'requests',
  'tickets',
  'payroll',
  'reports',
  'settings',
]

export function hasAnyModuleAccess(permissions: Set<string>): boolean {
  return (
    NAV_MODULE_KEYS.some((moduleKey) => canViewModule(permissions, moduleKey)) ||
    canViewModule(permissions, 'onboarding') ||
    canViewModule(permissions, 'offboarding')
  )
}

export function canViewEmployeesSection(permissions: Set<string>): boolean {
  return (
    canViewModule(permissions, 'employees') ||
    canViewModule(permissions, 'onboarding') ||
    canViewModule(permissions, 'offboarding')
  )
}

export const ALWAYS_ALLOWED_PATHS = ['/profile', '/notifications', '/settings'] as const

export function isPathAlwaysAllowed(pathname: string): boolean {
  return ALWAYS_ALLOWED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

const PATH_MODULE_MAP: Array<{ prefix: string; moduleKey: ModuleKey }> = [
  { prefix: '/employees', moduleKey: 'employees' },
  { prefix: '/attendance', moduleKey: 'attendance' },
  { prefix: '/documents', moduleKey: 'documents' },
  { prefix: '/assets', moduleKey: 'assets' },
  { prefix: '/requests', moduleKey: 'requests' },
  { prefix: '/tickets', moduleKey: 'tickets' },
  { prefix: '/payroll', moduleKey: 'payroll' },
  { prefix: '/reports', moduleKey: 'reports' },
  { prefix: '/settings', moduleKey: 'settings' },
]

/** Single source of truth for pathname → module. Returns null for always-allowed paths and unknown routes. */
export function resolveModuleFromPath(pathname: string): ModuleKey | null {
  if (isPathAlwaysAllowed(pathname)) {
    return null
  }

  if (pathname === '/') {
    return 'dashboard'
  }

  const match = PATH_MODULE_MAP.find(({ prefix }) => pathname.startsWith(prefix))
  return match?.moduleKey ?? null
}

export const SELF_SERVICE_MODULES: ReadonlySet<ModuleKey> = new Set([
  'dashboard',
  'attendance',
  'documents',
  'requests',
  'payroll',
])

export function hasEmployeeFallback(moduleKey: ModuleKey): boolean {
  return SELF_SERVICE_MODULES.has(moduleKey)
}

export function canAccessPathname(permissions: Set<string>, pathname: string): boolean {
  if (isPathAlwaysAllowed(pathname)) {
    return true
  }

  const moduleKey = resolveModuleFromPath(pathname)
  if (moduleKey === 'dashboard') {
    return true // Always allow access because it has an employee dashboard fallback
  }

  if (moduleKey === 'employees') {
    return canViewEmployeesSection(permissions)
  }

  if (moduleKey) {
    if (SELF_SERVICE_MODULES.has(moduleKey)) {
      return true // Always allow access because it has an employee fallback UI
    }
    return canViewModule(permissions, moduleKey)
  }

  return hasAnyModuleAccess(permissions)
}

export function moduleKeyFromPathname(pathname: string): ModuleKey {
  return resolveModuleFromPath(pathname) ?? 'dashboard'
}

