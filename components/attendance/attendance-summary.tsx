// components/attendance/attendance-summary.tsx
'use client'

import type { TeamAttendanceDay } from '@/types/attendance'
import { buildAttendanceSummaryLabel } from './attendance-day-summary'
import { AttendanceStatusPill } from './attendance-status-pill'

interface AttendanceSummaryProps {
  days: TeamAttendanceDay[]
}

export function AttendanceSummary({ days }: AttendanceSummaryProps) {
  if (days.length === 1) {
    return <AttendanceStatusPill status={days[0].status} />
  }

  return <span className="text-sm text-slate-300">{buildAttendanceSummaryLabel(days)}</span>
}
