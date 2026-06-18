// lib/permissions/use-module-gate.ts
'use client'

import { usePermissions } from '@/components/auth/permissions-provider'
import {
  hasEmployeeFallback,
  type ModuleAccessLevel,
  type ModuleKey,
} from '@/lib/permissions/module-permissions'

export interface ModuleGateState {
  isLoading: boolean
  level: ModuleAccessLevel
  isRestricted: boolean
  showAdminView: boolean
  showPersonalView: boolean
  isCombinedView: boolean
  isPersonalOnly: boolean
  isAdminOnly: boolean
  /** @deprecated Use isPersonalOnly */
  isPersonalView: boolean
  /** @deprecated Use isPersonalOnly */
  shouldRenderPersonalView: boolean
  canView: boolean
  canManage: boolean
  fetchEnabled: boolean
  personalFetchEnabled: boolean
}

export function useModuleGate(moduleKey: ModuleKey): ModuleGateState {
  const { isLoading, accessLevel, employeeProfileId } = usePermissions()
  const level = accessLevel(moduleKey)
  const hasFallback = hasEmployeeFallback(moduleKey)
  const showAdminView = !isLoading && level !== 'none'
  const showPersonalView =
    !isLoading && hasFallback && employeeProfileId !== null
  const isCombinedView = showAdminView && showPersonalView
  const isPersonalOnly = showPersonalView && !showAdminView
  const isAdminOnly = showAdminView && !showPersonalView

  return {
    isLoading,
    level,
    isRestricted: !isLoading && level === 'none' && !hasFallback,
    showAdminView,
    showPersonalView,
    isCombinedView,
    isPersonalOnly,
    isAdminOnly,
    isPersonalView: isPersonalOnly,
    shouldRenderPersonalView: isPersonalOnly,
    canView: !isLoading && (level !== 'none' || showPersonalView),
    canManage: !isLoading && level === 'manage',
    fetchEnabled: !isLoading && level !== 'none',
    personalFetchEnabled: showPersonalView,
  }
}
