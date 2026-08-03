// lib/mappers/attendance-mapper.ts
import { initialsFromName } from '@/lib/cookies'
import { formatPersonName, formatTitleLabel } from '@/lib/helpers/format-display-text'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceStatusCounts,
  BackendEmployeeAttendanceDay,
  TeamAttendanceDay,
  TeamAttendanceEmployee,
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

export interface BackendTeamAttendanceRecord {
  id?: number
  employee?: number
  employee_profile_id?: number
  employee_id: string | null
  employee_name: string
  role: string
  department: string
  email: string
  phone_number: string | null
  shift: string
  status?: string
  time_in?: string | null
  time_out?: string | null
  work_hours?: string
  break_hours?: string
  total_hours?: string
  timings?: { in: string | null; out: string | null }[]
  date?: string
  attendance_data?: BackendEmployeeAttendanceDay[]
  attendanceData?: BackendEmployeeAttendanceDay[]
  days?: BackendEmployeeAttendanceDay[]
  attendance_records?: BackendEmployeeAttendanceDay[]
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

function resolveEmployeeProfileId(
  record: Pick<BackendAttendanceRecord, 'employee' | 'employee_profile_id' | 'id'> & {
    employee_id?: string | null
  },
): number | null {
  return (
    toNumber(record.employee) ??
    toNumber(record.employee_profile_id) ??
    toNumber(record.id) ??
    parseNumericId(record.employee_id ?? undefined)
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

function hasHalfDayLeave(normalized: string): boolean {
  return (
    normalized.includes('half day leave') ||
    normalized.includes('half-day leave') ||
    normalized === 'on a half day leave'
  )
}

export function normalizeAttendanceStatus(status: string): AttendanceStatus {
  const normalized = status.trim().toLowerCase()
  const hasLate = normalized.includes('late')
  const hasWfh =
    normalized.includes('work from home') ||
    normalized.includes('work-from-home') ||
    normalized === 'wfh' ||
    normalized === 'workfromhome' ||
    normalized.includes(' wfh')

  if (hasLate && hasWfh) return 'late_wfh'
  if (hasHalfDayLeave(normalized)) return 'half_day_leave'
  if (hasWfh) return 'wfh'
  if (normalized === 'present') return 'present'
  if (normalized === 'late') return 'late'
  if (normalized === 'absent') return 'absent'
  if (normalized === 'on leave' || normalized === 'leave') return 'leave'
  if (
    normalized === 'holiday/weekend' ||
    normalized === 'weekend/holiday' ||
    (normalized.includes('holiday') && normalized.includes('weekend'))
  ) {
    return 'weekend'
  }
  if (normalized === 'weekend' || normalized === 'week off') return 'weekend'
  if (normalized === 'holiday') return 'holiday'
  return 'absent'
}

function resolveEmployeeId(
  record: Pick<BackendTeamAttendanceRecord, 'employee_id' | 'email' | 'employee_name'>,
): string {
  const rawId = record.employee_id?.trim()
  if (rawId) return rawId

  const email = record.email?.trim().toLowerCase()
  if (email) return email

  const slug = record.employee_name.trim().toLowerCase().replace(/\s+/g, '-')
  return `unknown-${slug || 'employee'}`
}

function extractBackendAttendanceDays(
  record: BackendTeamAttendanceRecord & Record<string, unknown>,
): BackendEmployeeAttendanceDay[] | undefined {
  const candidates = [
    record.attendance_data,
    record.attendanceData,
    record.days,
    record.attendance_records,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    if (Array.isArray(candidate)) {
      if (candidate.length > 0) return candidate as BackendEmployeeAttendanceDay[]
      continue
    }

    if (typeof candidate === 'object') {
      const values = Object.entries(candidate as Record<string, unknown>).map(
        ([date, day]) => ({
          ...(day as BackendEmployeeAttendanceDay),
          date: (day as BackendEmployeeAttendanceDay).date ?? date,
        }),
      )
      if (values.length > 0) return values
    }
  }

  return undefined
}

function mapBackendAttendanceDay(day: BackendEmployeeAttendanceDay): TeamAttendanceDay {
  return {
    date: day.date ?? '',
    dayOfWeek: day.day_of_week ?? '',
    status: normalizeAttendanceStatus(day.status ?? ''),
    excusedReason: day.excused_reason,
    timeIn: formatTimeValue(day.time_in ?? null),
    timeOut: formatTimeValue(day.time_out ?? null),
    workHours: formatWorkHours(day.work_hours),
    breakHours: formatWorkHours(day.break_hours),
    totalHours: formatWorkHours(day.total_hours),
    timings: (day.timings ?? []).map((t) => ({
      in: formatTimeValue(t.in),
      out: formatTimeValue(t.out),
    })),
    isBiometric: day.is_biometric,
  }
}

function synthesizeDayFromFlatRecord(record: BackendTeamAttendanceRecord): TeamAttendanceDay {
  return {
    date: record.date ?? '',
    dayOfWeek: '',
    status: normalizeAttendanceStatus(record.status ?? ''),
    timeIn: formatTimeValue(record.time_in ?? null),
    timeOut: formatTimeValue(record.time_out ?? null),
    workHours: formatWorkHours(record.work_hours),
    breakHours: formatWorkHours(record.break_hours),
    totalHours: formatWorkHours(record.total_hours),
    timings: (record.timings ?? []).map((t) => ({
      in: formatTimeValue(t.in),
      out: formatTimeValue(t.out),
    })),
  }
}

export function mapBackendTeamAttendanceRecord(
  record: BackendTeamAttendanceRecord,
): TeamAttendanceEmployee {
  const employeeName = formatPersonName(record.employee_name)
  const employeeProfileId = resolveEmployeeProfileId(record)
  const nestedDays = extractBackendAttendanceDays(
    record as BackendTeamAttendanceRecord & Record<string, unknown>,
  )
  const attendanceData =
    nestedDays && nestedDays.length > 0
      ? nestedDays.map(mapBackendAttendanceDay)
      : [synthesizeDayFromFlatRecord(record)]

  const employeeId = resolveEmployeeId(record)

  return {
    id: employeeId,
    employeeProfileId,
    employeeId,
    employeeName,
    initials: initialsFromName(employeeName),
    department: formatTitleLabel(record.department),
    shiftName: formatTitleLabel(record.shift),
    role: formatTitleLabel(record.role),
    email: record.email,
    phoneNumber: record.phone_number,
    attendanceData,
  }
}

export function mergeTeamAttendanceEmployees(
  employees: TeamAttendanceEmployee[],
): TeamAttendanceEmployee[] {
  const merged = new Map<string, TeamAttendanceEmployee>()

  for (const employee of employees) {
    const existing = merged.get(employee.employeeId)
    if (!existing) {
      merged.set(employee.employeeId, {
        ...employee,
        attendanceData: [...employee.attendanceData],
      })
      continue
    }

    const seenDates = new Set(existing.attendanceData.map((day) => day.date))
    for (const day of employee.attendanceData) {
      if (!day.date || seenDates.has(day.date)) continue
      seenDates.add(day.date)
      existing.attendanceData.push(day)
    }
  }

  return Array.from(merged.values()).map((employee) => ({
    ...employee,
    attendanceData: [...employee.attendanceData].sort((a, b) => a.date.localeCompare(b.date)),
  }))
}

export function toAttendanceRecord(
  employee: TeamAttendanceEmployee,
  day: TeamAttendanceDay,
): AttendanceRecord {
  return {
    id: `${employee.employeeId}-${day.date}`,
    employeeProfileId: employee.employeeProfileId,
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    initials: employee.initials,
    department: employee.department,
    shiftName: employee.shiftName,
    date: day.date,
    timeIn: day.timeIn,
    timeOut: day.timeOut,
    status: day.status,
    workHours: day.workHours,
    breakHours: day.breakHours,
    totalHours: day.totalHours,
    timings: day.timings,
    role: employee.role,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
  }
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
