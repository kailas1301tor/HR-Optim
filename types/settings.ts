// types/settings.ts
import type { DropdownItem } from '@/lib/types'

export type SettingsTab = 'company' | 'roles' | 'hr' | 'payroll' | 'assets' | 'system'

export type HRSection = 'masters' | 'workflows'

export const FIXED_CALCULATE_TYPE = 'Fixed Amount' as const

export interface SettingsMasterItem {
  id: number
  name: string
  subtitle?: string
}

export interface WorkflowTemplate {
  name: string
  steps: string[]
}

export interface NotificationPreferences {
  emailAlerts: boolean
  documentExpiry: boolean
  leaveRequests: boolean
  payrollUpdates: boolean
  systemUpdates: boolean
}

export interface PayRule {
  id: number
  name: string
  category: string
  trigger_basis: string
  calculate_type: string
  value: string
  base?: string | null
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface PayRuleChoices {
  category_choices: DropdownItem[]
  trigger_basis_choices: DropdownItem[]
  calculate_type_choices: DropdownItem[]
  base_choices: DropdownItem[]
}

export interface CreatePayRulePayload {
  name: string
  category: string
  trigger_basis: string
  calculate_type: string
  value: string
  base?: string
}

export interface UpdatePayRulePayload extends CreatePayRulePayload {
  id: number
}

export interface SettingsRole {
  name: string
  description: string
  permissions: string[]
}

export interface Holiday {
  id: number
  name: string
  date: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface WorkingDay {
  id: number
  name: string
  is_working_day: boolean
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateHolidayPayload {
  name: string
  date: string
}

export interface UpdateHolidayPayload {
  id: number
  name: string
  date: string
}

export interface UpdateWorkingDayPayload {
  id: number
  name: string
  is_working_day: boolean
}

export interface Branch {
  id: number
  name: string
  address: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface Department {
  id: number
  name: string
  description: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface Designation {
  id: number
  name: string
  description: string
  department: number
  department_name: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface BackendVendor {
  id: number
  asset_type: number
  name: string
  description?: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface FrontendVendor {
  id: number
  assetTypeId: number
  name: string
  description: string
}

export interface BackendShift {
  id: number
  name: string
  start_time: string
  end_time: string
  standard_work_hours: string
  is_active?: boolean
  deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface FrontendShift {
  id: number
  name: string
  startTime: string
  endTime: string
  standardWorkHours: number
}
