// lib/permissions/module-permissions.ts

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

export function moduleKeyFromPathname(pathname: string): ModuleKey {
  if (pathname === '/') {
    return 'dashboard'
  }

  const match = PATH_MODULE_MAP.find(({ prefix }) => pathname.startsWith(prefix))
  return match?.moduleKey ?? 'dashboard'
}
