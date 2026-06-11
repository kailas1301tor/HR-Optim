// components/attendance/attendance-constants.ts
import type { AttendanceStatus } from '@/types/attendance'

export type { AttendanceRecord, AttendanceStatus, AttendanceStatusCounts } from '@/types/attendance'
export { EMPTY_ATTENDANCE_STATUS_COUNTS as EMPTY_STATUS_COUNTS } from '@/types/attendance'

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; color: string; dotColor: string }
> = {
  present: { label: 'Present', color: 'bg-lime-400', dotColor: 'bg-lime-400' },
  late: { label: 'Late', color: 'bg-amber-400', dotColor: 'bg-amber-400' },
  absent: { label: 'Absent', color: 'bg-red-400', dotColor: 'bg-red-400' },
  leave: { label: 'On Leave', color: 'bg-slate-400', dotColor: 'bg-slate-400' },
  weekend: { label: 'Weekend', color: 'bg-slate-600', dotColor: 'bg-slate-600' },
}

const SHIFT_BADGE_CLASSES = [
  { match: /morning/i, className: 'bg-violet-core/20 text-violet-glow' },
  { match: /evening|afternoon/i, className: 'bg-amber-400/20 text-amber-400' },
  { match: /night/i, className: 'bg-teal-400/20 text-teal-400' },
] as const

export function getShiftBadgeClassName(shiftName: string): string {
  const matched = SHIFT_BADGE_CLASSES.find((item) => item.match.test(shiftName))
  return matched?.className ?? 'bg-midnight text-slate-300'
}
