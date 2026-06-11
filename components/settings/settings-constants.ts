// components/settings/settings-constants.ts
import type {
  NotificationPreferences,
  SettingsRole,
  WorkflowTemplate,
} from '@/types/settings'

export type { NotificationPreferences, SettingsRole, WorkflowTemplate } from '@/types/settings'

/** @deprecated Use SettingsRole from @/types/settings */
export type Role = SettingsRole

export const INITIAL_WORKFLOW_TEMPLATES: WorkflowTemplate[] = []

export const INITIAL_NOTIFICATIONS: NotificationPreferences = {
  emailAlerts: true,
  documentExpiry: true,
  leaveRequests: true,
  payrollUpdates: false,
  systemUpdates: true,
}
