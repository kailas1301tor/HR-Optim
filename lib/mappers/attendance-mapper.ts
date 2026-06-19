// lib/mappers/attendance-mapper.ts
import { initialsFromName } from '@/lib/cookies'
import { formatPersonName, formatTitleLabel } from '@/lib/helpers/format-display-text'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceStatusCounts,
} from '@/types/attendance'
export interface BackendAttendanceRecord {
  id?: number
  employee?: number
  employee_profile_id?: number
  employee_id: string
  employee_name: string
  role: string
  department: string
  email: string
  phone_number: string | null
  shift: string
  status: string
  time_in: string | null
  time_out: string | null
  work_hours: string
  break_hours?: string
  total_hours?: string
  timings?: { in: string | null; out: string | null }[]
  date?: string
}

export interface BackendAttendanceStatusCount {
  present: number
  late: number
  absent: number
  'on leave'?: number
  on_leave?: number
  weekend?: number
}

function parseNumericId(value: string | undefined): number | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') return parseNumericId(value)
  return null
}

function resolveEmployeeProfileId(record: BackendAttendanceRecord): number | null {
  return (
    toNumber(record.employee) ??
    toNumber(record.employee_profile_id) ??
    toNumber(record.id) ??
    parseNumericId(record.employee_id)
  )
}

function formatTimeValue(value: string | null): string | null {
  if (!value) return null
  const parts = value.split(':')
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`
  return value
}

function formatWorkHours(value: string | null | undefined): string | null {
  if (!value || value === '00:00') return null
  const parts = value.split(':')
  if (parts.length >= 2) {
    const hours = Number(parts[0])
    const minutes = parts[1]
    if (!Number.isNaN(hours)) return `${hours}h ${minutes}m`
  }
  return value
}

export function normalizeAttendanceStatus(status: string): AttendanceStatus {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'present') return 'present'
  if (normalized === 'late') return 'late'
  if (normalized === 'absent') return 'absent'
  if (normalized === 'on leave' || normalized === 'leave') return 'leave'
  if (normalized === 'weekend' || normalized === 'week off') return 'weekend'
  if (normalized === 'holiday') return 'holiday'
  return 'absent'
}

export function mapBackendAttendanceRecord(record: BackendAttendanceRecord): AttendanceRecord {
  const employeeName = formatPersonName(record.employee_name)
  const employeeProfileId = resolveEmployeeProfileId(record)
  return {
    id: record.employee_id,
    employeeProfileId,
    employeeId: record.employee_id,
    employeeName,
    initials: initialsFromName(employeeName),
    department: formatTitleLabel(record.department),
    shiftName: formatTitleLabel(record.shift),
    date: record.date || '',
    timeIn: formatTimeValue(record.time_in),
    timeOut: formatTimeValue(record.time_out),
    status: normalizeAttendanceStatus(record.status),
    workHours: formatWorkHours(record.work_hours),
    breakHours: formatWorkHours(record.break_hours),
    totalHours: formatWorkHours(record.total_hours),
    timings: (record.timings || []).map((t) => ({
      in: formatTimeValue(t.in),
      out: formatTimeValue(t.out),
    })),
    role: formatTitleLabel(record.role),
    email: record.email,
    phoneNumber: record.phone_number,
  }
}

export function mapBackendStatusCounts(data: BackendAttendanceStatusCount): AttendanceStatusCounts {
  return {
    present: data.present ?? 0,
    late: data.late ?? 0,
    absent: data.absent ?? 0,
    leave: data['on leave'] ?? data.on_leave ?? 0,
    weekend: data.weekend ?? 0,
  }
}
