// components/requests/forms/leave-calendar-panel.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, format, startOfMonth, startOfToday, subDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { parseApiDate } from '@/lib/helpers/format-api-date'
import { uiCalendarHeaderBtn, uiCalendarShell } from '@/lib/ui/design-system'
import type { LeaveCalendarEventKind } from '@/types/request'
import {
  CALENDAR_EVENT_CHIP_CLASSES,
  CALENDAR_LEGEND_ITEMS,
  CALENDAR_UI_LEGEND_ITEMS,
} from './calendar-event-styles'
import { MonthGridCalendar, type CalendarEvent } from './month-grid-calendar'

export interface LeaveCalendarPanelProps {
  fromDate: string
  toDate: string
  onRangeChange: (from: string, to: string) => void
  holidayDates?: Date[]
  holidayEvents?: CalendarEvent[]
  requestEvents?: CalendarEvent[]
  existingLeaveDates?: Date[]
  blockedDates?: Date[]
  onBlockedSelectionAttempt?: () => void
  disabled?: boolean
  className?: string
}

export function LeaveCalendarPanel({
  fromDate,
  toDate,
  onRangeChange,
  holidayDates = [],
  holidayEvents,
  requestEvents = [],
  existingLeaveDates = [],
  blockedDates = [],
  onBlockedSelectionAttempt,
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

  const resolvedHolidayEvents = useMemo((): CalendarEvent[] => {
    if (holidayEvents && holidayEvents.length > 0) return holidayEvents
    return holidayDates.map((date) => ({
      date: format(date, 'yyyy-MM-dd'),
      label: 'Holiday',
      kind: 'holiday' as const,
    }))
  }, [holidayDates, holidayEvents])

  const activeLegendKinds = useMemo(() => {
    const kinds = new Set<LeaveCalendarEventKind>()

    resolvedHolidayEvents.forEach((event) => {
      if (event.kind) kinds.add(event.kind)
    })

    requestEvents.forEach((event) => {
      if (event.kind) kinds.add(event.kind)
    })

    return CALENDAR_LEGEND_ITEMS.filter((item) => kinds.has(item.kind))
  }, [resolvedHolidayEvents, requestEvents])

  const hasSelectedRange = Boolean(fromDate && toDate)

  const handlePrevMonth = (): void => {
    setMonth((current) => addMonths(current, -1))
  }

  const handleNextMonth = (): void => {
    setMonth((current) => addMonths(current, 1))
  }

  const handleToday = (): void => {
    setMonth(startOfMonth(startOfToday()))
  }

  const showLegend =
    activeLegendKinds.length > 0 ||
    existingLeaveDates.length > 0 ||
    blockedDates.length > 0 ||
    hasSelectedRange

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
          disabledBefore={disabled ? undefined : subDays(startOfToday(), 30)}
          events={resolvedHolidayEvents}
          requestEvents={requestEvents}
          existingLeaveDates={existingLeaveDates}
          blockedDates={blockedDates}
          onBlockedSelectionAttempt={onBlockedSelectionAttempt}
          disabled={disabled}
          className="flex-1 flex flex-col min-h-0"
        />
      </div>

      {showLegend ? (
        <div
          className="rounded-xl border border-border/60 bg-card/40 px-3 py-3 space-y-2"
          role="note"
          aria-label="Calendar color guide"
        >
          <p className="text-[11px] font-semibold text-foreground">Calendar guide</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {activeLegendKinds.map((item) => (
              <div key={item.kind} className="flex items-start gap-2 min-w-0">
                <span
                  className={cn(
                    'mt-0.5 size-3 shrink-0 rounded-sm',
                    CALENDAR_EVENT_CHIP_CLASSES[item.kind],
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
            {CALENDAR_UI_LEGEND_ITEMS.map((item) => (
              <div key={item.id} className="flex items-start gap-2 min-w-0">
                <span
                  className={cn('mt-0.5 size-3 shrink-0', item.swatchClass)}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug pt-1 border-t border-border/40">
            Chips show the leave type and status for each day. Unavailable dates (booked leave, WFH,
            or holidays) cannot be selected. Rejected entries are informational only.
          </p>
        </div>
      ) : null}
    </div>
  )
}
