// lib/mappers/attendance-mapper.ts
import { initialsFromName } from '@/lib/cookies'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceStatusCounts,
} from '@/types/attendance'
export interface BackendAttendanceRecord {
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
}

export interface BackendAttendanceStatusCount {
  present: number
  late: number
  absent: number
  'on leave'?: number
  on_leave?: number
  weekend?: number
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
  return 'absent'
}

export function mapBackendAttendanceRecord(record: BackendAttendanceRecord): AttendanceRecord {
  return {
    id: record.employee_id,
    employeeId: record.employee_id,
    employeeName: record.employee_name,
    initials: initialsFromName(record.employee_name),
    department: record.department,
    shiftName: record.shift,
    date: '',
    timeIn: formatTimeValue(record.time_in),
    timeOut: formatTimeValue(record.time_out),
    status: normalizeAttendanceStatus(record.status),
    workHours: formatWorkHours(record.work_hours),
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
