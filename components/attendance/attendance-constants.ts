// components/attendance/attendance-constants.ts
import type { AttendanceStatus } from '@/types/attendance'

export type { AttendanceRecord, AttendanceStatus, AttendanceStatusCounts, TeamAttendanceEmployee, TeamAttendanceDay } from '@/types/attendance'
export { EMPTY_ATTENDANCE_STATUS_COUNTS as EMPTY_STATUS_COUNTS } from '@/types/attendance'

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; color: string; dotColor: string; pillClassName: string }
> = {
  present: {
    label: 'Present',
    color: 'bg-lime-400',
    dotColor: 'bg-lime-400',
    pillClassName: 'bg-lime-400/15 text-lime-400 border border-lime-400/30',
  },
  late: {
    label: 'Late',
    color: 'bg-amber-400',
    dotColor: 'bg-amber-400',
    pillClassName: 'bg-amber-400/15 text-amber-400 border border-amber-400/30',
  },
  absent: {
    label: 'Absent',
    color: 'bg-red-400',
    dotColor: 'bg-red-400',
    pillClassName: 'bg-red-400/15 text-red-400 border border-red-400/30',
  },
  leave: {
    label: 'On Leave',
    color: 'bg-slate-400',
    dotColor: 'bg-slate-400',
    pillClassName: 'bg-slate-400/15 text-slate-300 border border-slate-400/30',
  },
  weekend: {
    label: 'Holiday/Weekend',
    color: 'bg-slate-600',
    dotColor: 'bg-slate-600',
    pillClassName: 'bg-slate-600/15 text-slate-400 border border-slate-600/30',
  },
  holiday: {
    label: 'Holiday',
    color: 'bg-teal-400',
    dotColor: 'bg-teal-400',
    pillClassName: 'bg-teal-400/15 text-teal-400 border border-teal-400/30',
  },
}

const SHIFT_BADGE_CLASSES = [
  { match: /morning/i, className: 'bg-lime-400/15 text-lime-400 border border-lime-400/30' },
  { match: /evening|afternoon/i, className: 'bg-amber-400/20 text-amber-400' },
  { match: /night/i, className: 'bg-teal-400/20 text-teal-400' },
] as const

export function getShiftBadgeClassName(shiftName: string): string {
  const matched = SHIFT_BADGE_CLASSES.find((item) => item.match.test(shiftName))
  return matched?.className ?? 'bg-midnight text-slate-300'
}
