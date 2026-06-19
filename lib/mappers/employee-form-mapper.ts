// lib/mappers/employee-form-mapper.ts
import { formatTitleLabel } from '@/lib/helpers/format-display-text'
import type { CreateEmployeePayload, DropdownData, DropdownItem } from '@/types/employee'
import type { Employee } from '@/types/employee'
import type { EmployeeInput } from '@/validations/employee.schema'

export function findIdByName(list: DropdownItem[] | undefined, name: string): string {
  if (!list?.length || !name) return list?.[0] ? String(list[0].id) : ''
  const match = list.find((item) => item.name.toLowerCase() === name.toLowerCase())
  return match ? String(match.id) : String(list[0].id)
}

export function resolveDropdownId(
  list: DropdownItem[] | undefined,
  value: string | number | null | undefined,
): string {
  if (!list?.length || value === null || value === undefined || value === '') {
    return list?.[0] ? String(list[0].id) : ''
  }

  const normalized = String(value).trim()
  const byId = list.find((item) => String(item.id) === normalized)
  if (byId) return String(byId.id)

  return findIdByName(list, normalized)
}

export function resolveDropdownIdFromFk(
  list: DropdownItem[] | undefined,
  storedId: number | null | undefined,
  displayValue: string | null | undefined,
): string {
  if (!list?.length) return ''

  if (storedId && storedId > 0) {
    const byStoredId = list.find((item) => item.id === storedId)
    if (byStoredId) return String(byStoredId.id)
  }

  const label = displayValue?.trim()
  if (!label) return list[0] ? String(list[0].id) : ''

  const normalizedLabel = formatTitleLabel(label) || label
  return resolveDropdownId(list, normalizedLabel)
}

export function resolveChoiceName(
  list: DropdownItem[] | undefined,
  value: string | number | null | undefined,
): string {
  if (!list?.length || value === null || value === undefined || value === '') {
    return list?.[0]?.name ?? ''
  }

  const normalized = String(value).trim()
  const byId = list.find((item) => String(item.id) === normalized)
  if (byId) return byId.name

  const normalizedLabel = formatTitleLabel(normalized) || normalized
  const byName = list.find((item) => item.name.toLowerCase() === normalizedLabel.toLowerCase())
  if (byName) return byName.name

  return list[0]?.name ?? normalizedLabel
}

export function findNameByPreference(list: DropdownItem[] | undefined, preferred: string): string {
  if (!list?.length) return preferred
  const match = list.find((item) => item.name.toLowerCase() === preferred.toLowerCase())
  return match?.name ?? list[0].name
}

function toFormString(value: unknown): string {
  return value == null ? '' : String(value)
}

export function employeeToFormValues(employee: Employee, dropdowns: DropdownData): EmployeeInput {
  return {
    id: String(employee.id),
    username: toFormString(employee.user?.username),
    email: toFormString(employee.user?.email),
    full_name: toFormString(employee.full_name),
    phone_number: toFormString(employee.phone_number),
    role: resolveDropdownIdFromFk(dropdowns.roles, employee.role, employee.role_name),
    department: resolveDropdownIdFromFk(dropdowns.departments, undefined, employee.department),
    designation: resolveDropdownIdFromFk(dropdowns.designations, undefined, employee.designation),
    employee_id: toFormString(employee.employee_id),
    status: resolveChoiceName(dropdowns.status_choices, employee.status),
    shift: resolveDropdownIdFromFk(dropdowns.shifts, undefined, employee.shift),
    joined_date: employee.joined_date ? employee.joined_date.split('T')[0] : '',
    employee_type: resolveDropdownIdFromFk(dropdowns.employee_types, undefined, employee.employee_type),
    basic_salary: toFormString(employee.basic_salary),
    accommodation: resolveChoiceName(dropdowns.accommodation_choices, employee.accommodation),
    date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
    nationality: resolveDropdownIdFromFk(dropdowns.nationalities, undefined, employee.nationality),
    address: toFormString(employee.address),
    is_tl: !!employee.is_tl,
    is_manual_attendance_enabled: !!employee.is_manual_attendance_enabled,
    bank_name: toFormString(employee.bank_details?.bank_name),
    account_number: toFormString(employee.bank_details?.account_number),
    ifsc: toFormString(employee.bank_details?.ifsc),
    branch: toFormString(employee.bank_details?.branch),
  }
}

export function defaultFormValues(dropdowns: DropdownData): EmployeeInput {
  return {
    id: '',
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    role: dropdowns.roles[0] ? String(dropdowns.roles[0].id) : '',
    department: dropdowns.departments[0] ? String(dropdowns.departments[0].id) : '',
    designation: dropdowns.designations[0] ? String(dropdowns.designations[0].id) : '',
    employee_id: '',
    status: dropdowns.status_choices.length
      ? findNameByPreference(dropdowns.status_choices, 'Active')
      : '',
    shift: dropdowns.shifts[0] ? String(dropdowns.shifts[0].id) : '',
    joined_date: new Date().toISOString().split('T')[0],
    employee_type: dropdowns.employee_types[0] ? String(dropdowns.employee_types[0].id) : '',
    basic_salary: '',
    accommodation: dropdowns.accommodation_choices.length
      ? findNameByPreference(dropdowns.accommodation_choices, 'Not provided')
      : '',
    date_of_birth: '',
    nationality: dropdowns.nationalities[0] ? String(dropdowns.nationalities[0].id) : '',
    address: '',
    is_tl: false,
    is_manual_attendance_enabled: false,
    bank_name: '',
    account_number: '',
    ifsc: '',
    branch: '',
  }
}

export function formValuesToPayload(data: EmployeeInput): CreateEmployeePayload {
  return {
    username: data.username.trim(),
    email: data.email.trim(),
    full_name: data.full_name.trim(),
    phone_number: data.phone_number.trim(),
    role: Number(data.role),
    department: Number(data.department),
    designation: Number(data.designation),
    employee_id: data.employee_id.trim(),
    status: data.status,
    shift: Number(data.shift),
    joined_date: data.joined_date,
    employee_type: Number(data.employee_type),
    basic_salary: data.basic_salary,
    accommodation: data.accommodation,
    date_of_birth: data.date_of_birth,
    nationality: Number(data.nationality),
    address: data.address.trim(),
    is_tl: data.is_tl,
    is_manual_attendance_enabled: data.is_manual_attendance_enabled,
    bank_details: {
      bank_name: data.bank_name.trim(),
      account_number: data.account_number.trim(),
      ifsc: data.ifsc.trim(),
      branch: data.branch.trim(),
    },
  }
}

export function resolveActiveInactiveStatus(
  dropdowns: DropdownData | null,
  active: boolean,
): string {
  const choices = dropdowns?.status_choices ?? []
  const target = active ? 'active' : 'inactive'
  const match = choices.find((item) => item.name.toLowerCase() === target)
  return match?.name ?? (active ? 'Active' : 'Inactive')
}
