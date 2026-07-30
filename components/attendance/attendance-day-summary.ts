// components/attendance/attendance-day-summary.ts
import type { TeamAttendanceDay } from '@/types/attendance'
import { STATUS_CONFIG } from './attendance-constants'

function isPresentDay(status: TeamAttendanceDay['status']): boolean {
  return status === 'present' || status === 'late'
}

export function buildAttendanceSummaryLabel(days: TeamAttendanceDay[]): string {
  if (days.length === 0) return 'No records in range'

  const presentCount = days.filter((day) => isPresentDay(day.status)).length

  if (days.length === 1) {
    return isPresentDay(days[0].status) ? STATUS_CONFIG.present.label : '—'
  }

  if (presentCount === 0) {
    return `${days.length} days`
  }

  return `${days.length} days · ${presentCount} ${STATUS_CONFIG.present.label}`
}

export function getPrimaryDay(days: TeamAttendanceDay[]): TeamAttendanceDay | null {
  if (days.length === 0) return null
  if (days.length === 1) return days[0]
  return null
}
