// lib/mappers/asset-mapper.ts
import { isAssetInService } from '@/lib/helpers/asset-status'
import { formatPersonName, formatTitleLabel } from '@/lib/helpers/format-display-text'
import type { AssetDropdowns, Asset, CreateAssetPayload } from '@/types/asset'
import type { AssetInput } from '@/validations/asset.schema'

interface DepartmentLike {
  id: number
  name: string
}

type ApiRef = { id?: number; name?: string } | string | number | null | undefined

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function toString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  const s = String(value).trim()
  return s.length > 0 ? s : undefined
}

function resolveRefLabel(value: ApiRef): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return toString(value.name)
  }
  if (typeof value === 'string') return toString(value)
  return undefined
}

function resolveRefId(value: ApiRef): number | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return toNumber(value.id)
  }
  if (typeof value === 'number') return value
  return undefined
}

function normalizeDepartmentName(name: string | undefined): string | undefined {
  if (!name) return undefined
  return name.replace(/^@\s*/, '').trim() || undefined
}

export function normalizeDateForInput(value: string | null | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10)
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

function resolveDropdownId(
  storedId: number | undefined,
  displayValue: string | undefined,
  options: Array<{ id: number; name: string }> | undefined
): number {
  if (storedId && storedId > 0) return storedId
  if (!displayValue || !options?.length) return 0
  const normalized = displayValue.toLowerCase()
  const match = options.find((o) => o.name.toLowerCase() === normalized)
  return match?.id ?? 0
}

function resolveDepartmentId(
  storedId: number | undefined,
  displayValue: string | undefined,
  departments: DepartmentLike[]
): number {
  if (storedId && storedId > 0) return storedId
  const normalized = normalizeDepartmentName(displayValue)?.toLowerCase()
  if (!normalized) return 0
  const match = departments.find(
    (d) => d.name.toLowerCase() === normalized || d.name.toLowerCase().includes(normalized)
  )
  return match?.id ?? 0
}

function extractEmployeeFromObject(value: unknown): { id?: number; name?: string } {
  if (typeof value !== 'object' || value === null) return {}
  const obj = value as Record<string, unknown>
  const firstName = toString(obj.first_name)
  const lastName = toString(obj.last_name)
  const combinedName =
    firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName ?? lastName
  const name =
    toString(obj.name) ||
    toString(obj.full_name) ||
    toString(obj.employee_name) ||
    toString(obj.display_name) ||
    combinedName
  const id = toNumber(obj.id) ?? toNumber(obj.employee_id)
  return { id, name }
}

function resolveLegacyAssigneeName(raw: Record<string, unknown>): string | undefined {
  const objectKeys = [
    'assigned_to_employee',
    'assigned_employee',
    'current_assignee',
    'assignee',
    'employee',
  ] as const

  for (const key of objectKeys) {
    const candidate = raw[key]
    if (typeof candidate === 'object' && candidate !== null) {
      const extracted = extractEmployeeFromObject(candidate)
      if (extracted.name) return extracted.name
    }
  }

  return (
    toString(raw.assigned_to_employee_name) ||
    toString(raw.employee_name) ||
    toString(raw.assignee_name) ||
    toString(raw.assigned_employee_name) ||
    toString(raw.current_assignee_name)
  )
}

function resolveAssignment(raw: Record<string, unknown>): {
  assigned: string | null
  assigned_to_employee: number | null
  assigned_department: number | null
} {
  const assignedEmployeeId =
    toNumber(raw.assigned_employee) ??
    toNumber(raw.assigned_to_employee) ??
    toNumber(raw.assigned_employee_id) ??
    toNumber(raw.assignee_id) ??
    toNumber(raw.employee_id) ??
    null

  const assignedDepartmentId = toNumber(raw.assigned_department) ?? null

  const assigned =
    formatPersonName(toString(raw.assigned) ?? resolveLegacyAssigneeName(raw) ?? undefined) || null

  return {
    assigned,
    assigned_to_employee: assignedEmployeeId,
    assigned_department: assignedDepartmentId,
  }
}

export function mapAssetFromApi(raw: Record<string, unknown>): Asset {
  const assetTypeRaw = raw.asset_type
  const categoryRaw = raw.asset_category
  const departmentRaw = raw.department
  const statusRaw = raw.status

  const assignment = resolveAssignment(raw)

  const rawDepartment =
    normalizeDepartmentName(resolveRefLabel(departmentRaw as ApiRef) ?? toString(departmentRaw)) ??
    toString(departmentRaw)
  const rawStatus = resolveRefLabel(statusRaw as ApiRef) ?? toString(statusRaw)

  return {
    id: toNumber(raw.id) ?? 0,
    name: toString(raw.name) ?? '',
    serial_number: toString(raw.serial_number) ?? null,
    asset_type: resolveRefLabel(assetTypeRaw as ApiRef) ?? toString(assetTypeRaw),
    asset_category: resolveRefLabel(categoryRaw as ApiRef) ?? toString(categoryRaw),
    department: rawDepartment ? formatTitleLabel(rawDepartment) : rawDepartment,
    status: rawStatus ? formatTitleLabel(rawStatus) : rawStatus,
    asset_type_id:
      toNumber(raw.asset_type_id) ?? resolveRefId(assetTypeRaw as ApiRef),
    asset_category_id:
      toNumber(raw.asset_category_id) ?? resolveRefId(categoryRaw as ApiRef),
    department_id:
      toNumber(raw.department_id) ?? resolveRefId(departmentRaw as ApiRef),
    status_id: toNumber(raw.status_id) ?? resolveRefId(statusRaw as ApiRef),
    assigned: assignment.assigned,
    assigned_to_employee: assignment.assigned_to_employee,
    assigned_department: assignment.assigned_department,
    assigned_to_employee_name:
      assignment.assigned_to_employee != null ? assignment.assigned : null,
    employee_name:
      assignment.assigned_to_employee != null ? assignment.assigned : null,
    location: toString(raw.location) ?? null,
    sub_location: toString(raw.sub_location) ?? null,
    purchase_cost: raw.purchase_cost != null ? String(raw.purchase_cost) : null,
    purchase_date: toString(raw.purchase_date) ?? null,
    warranty_period: toNumber(raw.warranty_period) ?? null,
    service_due_date: toString(raw.service_due_date) ?? null,
    created_at: toString(raw.created_at) ?? '',
    updated_at: toString(raw.updated_at) ?? '',
    is_active: Boolean(raw.is_active ?? true),
    deleted: Boolean(raw.deleted ?? false),
  }
}

export function assetToFormValues(
  asset: Asset,
  dropdowns: AssetDropdowns | null,
  departments: DepartmentLike[]
): AssetInput {
  const typeId = resolveDropdownId(
    asset.asset_type_id,
    asset.asset_type,
    dropdowns?.asset_types
  )
  const categoryId = resolveDropdownId(
    asset.asset_category_id,
    asset.asset_category,
    dropdowns?.asset_categories
  )
  const deptId = resolveDepartmentId(asset.department_id, asset.department, departments)
  const statusId = resolveDropdownId(asset.status_id, asset.status, dropdowns?.asset_status)

  return {
    id: asset.id,
    name: asset.name,
    serial_number: asset.serial_number || '',
    asset_type: typeId,
    asset_category: categoryId,
    department: deptId,
    location: asset.location || '',
    sub_location: asset.sub_location || '',
    purchase_cost: asset.purchase_cost || '',
    purchase_date: normalizeDateForInput(asset.purchase_date),
    warranty_period: asset.warranty_period ? String(asset.warranty_period) : '',
    service_due_date: normalizeDateForInput(asset.service_due_date),
    status: statusId,
  }
}

export function defaultAssetFormValues(): AssetInput {
  return {
    name: '',
    serial_number: '',
    asset_type: 0,
    asset_category: 0,
    department: 0,
    location: '',
    sub_location: '',
    purchase_cost: '',
    purchase_date: '',
    warranty_period: '',
    service_due_date: '',
    status: 0,
  }
}

export function formValuesToPayload(data: AssetInput): CreateAssetPayload {
  return {
    name: data.name,
    serial_number: data.serial_number || null,
    asset_type: data.asset_type || null,
    asset_category: data.asset_category || null,
    department: data.department || null,
    location: data.location || null,
    sub_location: data.sub_location || null,
    purchase_cost: data.purchase_cost ? parseFloat(data.purchase_cost) : null,
    purchase_date: data.purchase_date || null,
    warranty_period: data.warranty_period ? parseInt(data.warranty_period, 10) : null,
    service_due_date: data.service_due_date || null,
    status: data.status || null,
  }
}

export function computePageAssetStats(
  assets: Asset[],
  totalCount: number,
  totalPages: number,
  isFiltered: boolean
) {
  const inServiceCount = assets.filter((a) => isAssetInService(a.status)).length
  const totalValue = assets.reduce(
    (sum, a) => sum + (a.purchase_cost ? parseFloat(a.purchase_cost) : 0),
    0
  )
  const utilizationDenominator = Math.max(assets.length, 1)
  const utilizationRate = Math.round((inServiceCount / utilizationDenominator) * 100)
  const isPageScoped = isFiltered || totalPages > 1

  return {
    totalCount,
    inServiceCount,
    utilizationRate,
    totalValue,
    totalValueLabel: `₹${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    isPageScoped,
  }
}
