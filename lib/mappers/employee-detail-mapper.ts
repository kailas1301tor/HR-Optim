// lib/mappers/employee-detail-mapper.ts
import { normalizeDateForInput } from '@/lib/mappers/asset-mapper'
import type { Employee, EmployeeBankDetails, EmployeeUser } from '@/types/employee'

type ApiRef = { id?: number; name?: string } | string | number | null | undefined

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function toString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function resolveRefLabel(value: ApiRef): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object' && value !== null && 'name' in value) {
    return toString(value.name)
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return toString(value)
  }
  return ''
}

function resolveRefId(value: ApiRef): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return toNumber(value.id) ?? 0
  }
  if (typeof value === 'number') return value
  return toNumber(value) ?? 0
}

function resolveFkField(
  raw: Record<string, unknown>,
  baseKey: string,
): { id: number; label: string } {
  const nested = raw[baseKey]
  const explicitId = toNumber(raw[`${baseKey}_id`])
  const explicitName = toString(raw[`${baseKey}_name`])

  const nestedId = resolveRefId(nested as ApiRef)
  const nestedLabel = resolveRefLabel(nested as ApiRef)

  const id = explicitId ?? nestedId ?? (typeof nested === 'number' ? nested : 0)
  const label =
    explicitName ||
    nestedLabel ||
    (typeof nested === 'string' ? toString(nested) : '')

  return { id, label }
}

function normalizeUser(raw: unknown): EmployeeUser {
  if (typeof raw !== 'object' || raw === null) {
    return { username: '', email: '' }
  }
  const user = raw as Record<string, unknown>
  return {
    id: toNumber(user.id),
    username: toString(user.username),
    email: toString(user.email),
  }
}

function normalizeBankDetails(raw: unknown): EmployeeBankDetails {
  if (typeof raw !== 'object' || raw === null) {
    return { bank_name: '', account_number: '', ifsc: '', branch: '' }
  }
  const bank = raw as Record<string, unknown>
  return {
    bank_name: toString(bank.bank_name),
    account_number: toString(bank.account_number),
    ifsc: toString(bank.ifsc),
    branch: toString(bank.branch),
  }
}

export function normalizeEmployeeFromApi(raw: unknown): Employee {
  if (typeof raw !== 'object' || raw === null) {
    return {
      id: 0,
      user: { username: '', email: '' },
      bank_details: { bank_name: '', account_number: '', ifsc: '', branch: '' },
      full_name: '',
      phone_number: '',
      employee_id: '',
      role: 0,
      role_name: '',
      department: '',
      designation: '',
      status: '',
      shift: '',
      employee_type: '',
      nationality: '',
      joined_date: '',
      basic_salary: '',
      accommodation: '',
      date_of_birth: '',
      address: '',
      is_tl: false,
      is_manual_attendance_enabled: false,
    }
  }

  const data = raw as Record<string, unknown>
  const role = resolveFkField(data, 'role')
  const department = resolveFkField(data, 'department')
  const designation = resolveFkField(data, 'designation')
  const shift = resolveFkField(data, 'shift')
  const employeeType = resolveFkField(data, 'employee_type')
  const nationality = resolveFkField(data, 'nationality')
  const status = resolveFkField(data, 'status')
  const accommodation = resolveFkField(data, 'accommodation')

  return {
    id: toNumber(data.id) ?? 0,
    user: normalizeUser(data.user),
    bank_details: normalizeBankDetails(data.bank_details),
    full_name: toString(data.full_name),
    phone_number: toString(data.phone_number),
    employee_id: toString(data.employee_id),
    role: role.id,
    role_name: role.label || toString(data.role_name),
    department: department.label,
    designation: designation.label,
    status: status.label,
    shift: shift.label,
    employee_type: employeeType.label,
    nationality: nationality.label,
    joined_date: normalizeDateForInput(toString(data.joined_date) || undefined),
    basic_salary: toString(data.basic_salary),
    accommodation: accommodation.label,
    date_of_birth: normalizeDateForInput(toString(data.date_of_birth) || undefined),
    address: toString(data.address),
    is_tl: Boolean(data.is_tl),
    is_manual_attendance_enabled: Boolean(data.is_manual_attendance_enabled),
  }
}
