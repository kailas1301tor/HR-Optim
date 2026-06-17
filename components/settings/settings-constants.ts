// components/settings/settings-constants.ts
import type {
  SettingsRole,
  WorkflowTemplate,
} from '@/types/settings'

export type { SettingsRole, WorkflowTemplate } from '@/types/settings'

/** @deprecated Use SettingsRole from @/types/settings */
export type Role = SettingsRole

export const INITIAL_WORKFLOW_TEMPLATES: WorkflowTemplate[] = []

export const SETTINGS_MASTER_TABS = [
  'company',
  'roles',
  'hr',
  'payroll',
  'assets',
] as const

export const SETTINGS_SELF_SERVICE_TABS = ['security', 'system'] as const

export type SettingsMasterTab = (typeof SETTINGS_MASTER_TABS)[number]
export type SettingsSelfServiceTab = (typeof SETTINGS_SELF_SERVICE_TABS)[number]
export type SettingsTab = SettingsMasterTab | SettingsSelfServiceTab

export function isSettingsMasterTab(tab: string): tab is SettingsMasterTab {
  return (SETTINGS_MASTER_TABS as readonly string[]).includes(tab)
}
