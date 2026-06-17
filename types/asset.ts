// types/asset.ts
import type { DropdownItem, StringDropdownItem } from '@/lib/types'

export type { DropdownItem, StringDropdownItem }

export interface AssetDropdowns {
  asset_types: DropdownItem[]
  asset_categories: DropdownItem[]
  maintenance_shops: DropdownItem[]
  vendors: DropdownItem[]
  service_types: DropdownItem[]
  asset_status: DropdownItem[]
  disposal_choices: StringDropdownItem[]
  asset_document_types: DropdownItem[]
}

export interface AssignAssetPayload {
  asset_id: number
  assign_to_employee: number
  remarks?: string
}

export interface TransferAssetPayload {
  asset_id: number
  transfer_to_department: number
  remarks?: string
}

export interface ScheduleMaintenancePayload {
  asset_id: number
  service_type: number
  service_provider: number
  estimated_cost: number
}

export type ReturnAssetTarget = 'department' | 'employee'

export interface ReturnAssetPayloadBase {
  asset_id: number
  return_date: string
  service_cost?: number
}

export interface ReturnAssetToDepartmentPayload extends ReturnAssetPayloadBase {
  return_to_department: number
}

export interface ReturnAssetToEmployeePayload extends ReturnAssetPayloadBase {
  return_to_employee: number
}

export type ReturnAssetPayload = ReturnAssetToDepartmentPayload | ReturnAssetToEmployeePayload

/** @deprecated Use ReturnAssetToDepartmentPayload */
export type ReturnAssetDepartmentPayload = ReturnAssetToDepartmentPayload

export interface DisposeAssetPayload {
  asset: number
  disposal_date: string
  disposal_method: string
  disposal_value: number
}

export interface AddAMCPayload {
  asset: number
  service_provider: number
  contract_number: string
  start_date: string
  end_date: string
  amc_cost: number
  coverage_details: string
}

export interface AssetHistoryEntry {
  id: number
  action: string
  date: string
  performed_by: string
  remarks?: string
}

export interface AssetDocument {
  id: number
  document_type: string
  file_url: string
  uploaded_at: string
}

export interface AssetAMC {
  id: number
  contract_number: string
  service_provider: string
  start_date: string
  end_date: string
  amc_cost: string
  status: string
  coverage_details: string
}

export interface AssetDisposal {
  id: number
  disposal_date: string
  disposal_method: string
  disposal_value: string
}

export interface Asset {
  id: number
  asset_type?: string
  asset_category?: string
  department?: string
  status?: string
  asset_type_id?: number
  asset_category_id?: number
  department_id?: number
  status_id?: number
  /** Primary assignee display name from API (`assigned` field) */
  assigned?: string | null
  assigned_to_employee?: number | null
  assigned_department?: number | null
  assigned_to_employee_name?: string | null
  employee_name?: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  deleted: boolean
  name: string
  serial_number: string | null
  location: string | null
  sub_location: string | null
  purchase_cost: string | null
  purchase_date: string | null
  warranty_period: number | null
  service_due_date: string | null
}

/** @deprecated Use `Asset` — kept for gradual migration */
export type BackendAsset = Asset

export interface CreateAssetPayload {
  name: string
  serial_number?: string | null
  asset_type?: number | null
  asset_category?: number | null
  department?: number | null
  location?: string | null
  sub_location?: string | null
  purchase_cost?: number | null
  purchase_date?: string | null
  warranty_period?: number | null
  service_due_date?: string | null
  status?: number | null
}

export interface AssetListParams {
  page?: number
  page_size?: number
  search?: string
  asset_type?: number | string
  status?: number | string
  [key: string]: string | number | boolean | undefined | null
}

export interface PageAssetStats {
  totalCount: number
  inServiceCount: number
  utilizationRate: number
  totalValue: number
  totalValueLabel: string
  isPageScoped: boolean
}
