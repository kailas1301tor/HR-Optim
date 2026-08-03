// components/attendance/attendance-time-display.tsx
'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TeamAttendanceDay } from '@/types/attendance'

interface AttendanceTimeValueProps {
  value: string | null | undefined
  fallback?: string
  className?: string
}

export function AttendanceTimeValue({
  value,
  fallback = '--:--',
  className,
}: AttendanceTimeValueProps) {
  return (
    <div className={cn('flex items-center gap-1.5 font-mono text-cloud', className)}>
      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
      <span>{value || fallback}</span>
    </div>
  )
}

interface AttendanceDayTimeGridProps {
  day: TeamAttendanceDay
  className?: string
}

export function AttendanceDayTimeGrid({ day, className }: AttendanceDayTimeGridProps) {
  const timeWorked = day.workHours || day.totalHours

  return (
    <div className={cn('grid grid-cols-3 gap-2 text-[10px]', className)}>
      <div>
        <p className="text-muted-foreground mb-0.5">Check In</p>
        <AttendanceTimeValue value={day.timeIn} className="text-xs" />
      </div>
      <div>
        <p className="text-muted-foreground mb-0.5">Check Out</p>
        <AttendanceTimeValue value={day.timeOut} className="text-xs" />
      </div>
      <div>
        <p className="text-muted-foreground mb-0.5">Time Worked</p>
        <span className="font-mono text-xs text-cloud">{timeWorked || '--'}</span>
      </div>
    </div>
  )
}
