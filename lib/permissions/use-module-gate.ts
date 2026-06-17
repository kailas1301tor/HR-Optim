// lib/permissions/use-module-gate.ts
'use client'

import { getCachedPermissionsSnapshot } from '@/components/auth/permissions-provider'
import { usePermissions } from '@/components/auth/permissions-provider'
import {
  canViewModule,
  hasEmployeeFallback,
  type ModuleAccessLevel,
  type ModuleKey,
} from '@/lib/permissions/module-permissions'

export interface ModuleGateState {
  isLoading: boolean
  level: ModuleAccessLevel
  isRestricted: boolean
  isPersonalView: boolean
  shouldRenderPersonalView: boolean
  canView: boolean
  canManage: boolean
  fetchEnabled: boolean
  personalFetchEnabled: boolean
}

function likelyHasModuleAccess(moduleKey: ModuleKey): boolean {
  const snapshot = getCachedPermissionsSnapshot()
  if (!snapshot) return false
  return canViewModule(snapshot.permissions, moduleKey)
}

export function useModuleGate(moduleKey: ModuleKey): ModuleGateState {
  const { isLoading, accessLevel } = usePermissions()
  const level = accessLevel(moduleKey)
  const isPersonal = level === 'none' && hasEmployeeFallback(moduleKey)
  const isPersonalView = !isLoading && isPersonal
  const shouldRenderPersonalView =
    isPersonalView ||
    (isLoading && hasEmployeeFallback(moduleKey) && !likelyHasModuleAccess(moduleKey))

  return {
    isLoading,
    level,
    isRestricted: !isLoading && level === 'none' && !hasEmployeeFallback(moduleKey),
    isPersonalView,
    shouldRenderPersonalView,
    canView: !isLoading && (level !== 'none' || isPersonal),
    canManage: !isLoading && level === 'manage',
    fetchEnabled: !isLoading && level !== 'none',
    personalFetchEnabled: !isLoading && isPersonal,
  }
}
