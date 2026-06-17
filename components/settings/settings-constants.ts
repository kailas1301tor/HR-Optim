// components/settings/settings-constants.ts
import type {
  SettingsRole,
  WorkflowTemplate,
} from '@/types/settings'

export type { SettingsRole, WorkflowTemplate } from '@/types/settings'

/** @deprecated Use SettingsRole from @/types/settings */
export type Role = SettingsRole

export const INITIAL_WORKFLOW_TEMPLATES: WorkflowTemplate[] = []
