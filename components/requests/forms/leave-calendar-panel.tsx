// components/requests/forms/leave-calendar-panel.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, format, startOfMonth, startOfToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { parseApiDate } from '@/lib/helpers/format-api-date'
import { uiCalendarHeaderBtn, uiCalendarShell } from '@/lib/ui/design-system'
import { MonthGridCalendar, type CalendarEvent } from './month-grid-calendar'

export interface LeaveCalendarPanelProps {
  fromDate: string
  toDate: string
  onRangeChange: (from: string, to: string) => void
  holidayDates?: Date[]
  holidayEvents?: CalendarEvent[]
  existingLeaveDates?: Date[]
  disabled?: boolean
  className?: string
}

export function LeaveCalendarPanel({
  fromDate,
  toDate,
  onRangeChange,
  holidayDates = [],
  holidayEvents,
  existingLeaveDates = [],
  disabled = false,
  className,
}: LeaveCalendarPanelProps) {
  const [month, setMonth] = useState(() => {
    const from = parseApiDate(fromDate)
    return from ? startOfMonth(from) : startOfMonth(startOfToday())
  })

  useEffect(() => {
    const from = parseApiDate(fromDate)
    if (from) {
      setMonth(startOfMonth(from))
    }
  }, [fromDate])

  const resolvedEvents = useMemo((): CalendarEvent[] => {
    if (holidayEvents && holidayEvents.length > 0) return holidayEvents
    return holidayDates.map((date) => ({
      date: format(date, 'yyyy-MM-dd'),
      label: 'Holiday',
    }))
  }, [holidayDates, holidayEvents])

  const handlePrevMonth = (): void => {
    setMonth((current) => addMonths(current, -1))
  }

  const handleNextMonth = (): void => {
    setMonth((current) => addMonths(current, 1))
  }

  const handleToday = (): void => {
    setMonth(startOfMonth(startOfToday()))
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0 gap-4', className)}>
      <div className={cn('flex flex-col flex-1 min-h-0', uiCalendarShell)}>
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6 lg:py-5 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground tabular-nums">
            {format(month, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className={cn('size-8', uiCalendarHeaderBtn)}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleToday}
              className={cn('px-3 h-8 text-xs bg-muted/60', uiCalendarHeaderBtn)}
              aria-label="Go to today"
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className={cn('size-8', uiCalendarHeaderBtn)}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <MonthGridCalendar
          month={month}
          fromDate={fromDate}
          toDate={toDate}
          onRangeChange={onRangeChange}
          disabledBefore={disabled ? undefined : startOfToday()}
          events={resolvedEvents}
          existingLeaveDates={existingLeaveDates}
          disabled={disabled}
          className="flex-1 flex flex-col min-h-0"
        />
      </div>

      {(resolvedEvents.length > 0 || existingLeaveDates.length > 0) && (
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground px-1">
          {resolvedEvents.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-violet-500/80" aria-hidden />
              Holiday
            </span>
          )}
          {existingLeaveDates.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-violet-core/60" aria-hidden />
              Existing leave
            </span>
          )}
        </div>
      )}
    </div>
  )
}
