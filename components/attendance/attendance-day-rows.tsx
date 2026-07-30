// components/attendance/attendance-day-rows.tsx
'use client'

import { Clock } from 'lucide-react'
import { formatDisplayDate } from '@/lib/helpers/format-api-date'
import { cn } from '@/lib/utils'
import { STATUS_CONFIG } from './attendance-constants'
import type { TeamAttendanceDay } from '@/types/attendance'

interface AttendanceDayRowsProps {
  days: TeamAttendanceDay[]
  onDayClick?: (day: TeamAttendanceDay) => void
  compact?: boolean
}

export function AttendanceDayRows({ days, onDayClick, compact = false }: AttendanceDayRowsProps) {
  if (days.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">No records in range</p>
    )
  }

  return (
    <div className="divide-y divide-border/30">
      {days.map((day) => {
        const status = STATUS_CONFIG[day.status]
        return (
          <button
            key={day.date}
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDayClick?.(day)
            }}
            className={cn(
              'w-full text-left transition-colors hover:bg-violet-core/5',
              compact ? 'py-2.5 px-1' : 'py-3 px-1',
              onDayClick && 'cursor-pointer',
            )}
            aria-label={`${formatDisplayDate(day.date)} — ${status.label}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-cloud">{formatDisplayDate(day.date)}</p>
                {day.dayOfWeek ? (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{day.dayOfWeek}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className={cn('w-1.5 h-1.5 rounded-full', status.dotColor)} aria-hidden />
                <span className="text-xs text-slate-300">{status.label}</span>
              </div>
            </div>
            {!compact ? (
              <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                <div>
                  <p className="text-muted-foreground mb-0.5">In</p>
                  <div className="flex items-center gap-1 font-mono text-cloud">
                    <Clock className="w-3 h-3 text-slate-500" aria-hidden />
                    {day.timeIn || '--:--'}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Out</p>
                  <div className="flex items-center gap-1 font-mono text-cloud">
                    <Clock className="w-3 h-3 text-slate-500" aria-hidden />
                    {day.timeOut || '--:--'}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Hours</p>
                  <span className="font-mono text-cloud">{day.workHours || '--'}</span>
                </div>
              </div>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
