// components/attendance/attendance-constants.ts

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'weekend'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  initials: string
  department: string
  shiftName: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: AttendanceStatus
  workHours: string | null
}

export interface AttendanceStatusCounts {
  present: number
  late: number
  absent: number
  leave: number
  weekend: number
}

export const STATUS_CONFIG = {
  present: { label: 'Present', color: 'bg-lime-400', dotColor: 'bg-lime-400' },
  late: { label: 'Late', color: 'bg-amber-400', dotColor: 'bg-amber-400' },
  absent: { label: 'Absent', color: 'bg-red-400', dotColor: 'bg-red-400' },
  leave: { label: 'On Leave', color: 'bg-slate-400', dotColor: 'bg-slate-400' },
  weekend: { label: 'Weekend', color: 'bg-slate-600', dotColor: 'bg-slate-600' },
} as const

const SHIFT_BADGE_CLASSES = [
  { match: /morning/i, className: 'bg-violet-core/20 text-violet-glow' },
  { match: /evening|afternoon/i, className: 'bg-amber-400/20 text-amber-400' },
  { match: /night/i, className: 'bg-teal-400/20 text-teal-400' },
] as const

export function getShiftBadgeClassName(shiftName: string): string {
  const matched = SHIFT_BADGE_CLASSES.find((item) => item.match.test(shiftName))
  return matched?.className ?? 'bg-midnight text-slate-300'
}

export const EMPTY_STATUS_COUNTS: AttendanceStatusCounts = {
  present: 0,
  late: 0,
  absent: 0,
  leave: 0,
  weekend: 0,
}
