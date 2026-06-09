// components/requests/forms/month-grid-calendar.tsx
'use client'

import { useMemo } from 'react'
import { Star } from 'lucide-react'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import {
  uiCalendarCellBase,
  uiCalendarCellInMonth,
  uiCalendarCellOutMonth,
  uiCalendarGrid,
} from '@/lib/ui/design-system'

export interface CalendarEvent {
  date: string
  label: string
}

export interface MonthGridCalendarProps {
  month: Date
  fromDate: string
  toDate: string
  onRangeChange: (from: string, to: string) => void
  disabledBefore?: Date
  events?: CalendarEvent[]
  existingLeaveDates?: Date[]
  disabled?: boolean
  className?: string
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function isDateInRange(day: Date, from: Date | undefined, to: Date | undefined): boolean {
  if (!from || !to) return false
  const d = startOfDay(day).getTime()
  const start = startOfDay(from).getTime()
  const end = startOfDay(to).getTime()
  return d >= Math.min(start, end) && d <= Math.max(start, end)
}

function formatCellDateLabel(day: Date): string {
  if (day.getDate() === 1) {
    return format(day, 'd MMM')
  }
  return format(day, 'd')
}

export function MonthGridCalendar({
  month,
  fromDate,
  toDate,
  onRangeChange,
  disabledBefore,
  events = [],
  existingLeaveDates = [],
  disabled = false,
  className,
}: MonthGridCalendarProps) {
  const from = parseApiDate(fromDate)
  const to = parseApiDate(toDate)

  const days = useMemo(() => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    })
  }, [month])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((event) => {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    })
    return map
  }, [events])

  const existingLeaveSet = useMemo(() => {
    return new Set(existingLeaveDates.map((d) => formatApiDate(d)))
  }, [existingLeaveDates])

  const handleDayClick = (day: Date): void => {
    if (disabled) return

    const dayStart = startOfDay(day)
    if (disabledBefore && isBefore(dayStart, startOfDay(disabledBefore))) return

    const dayStr = formatApiDate(day)
    const hasCompleteRange = from && to && fromDate !== toDate

    if (!from || !to || hasCompleteRange) {
      onRangeChange(dayStr, dayStr)
      return
    }

    if (fromDate === toDate && from) {
      if (isBefore(day, from)) {
        onRangeChange(dayStr, formatApiDate(from))
      } else {
        onRangeChange(formatApiDate(from), dayStr)
      }
    }
  }

  const isDayDisabled = (day: Date): boolean => {
    if (disabled) return true
    if (!disabledBefore) return false
    return isBefore(startOfDay(day), startOfDay(disabledBefore))
  }

  return (
    <div className={cn('flex h-full w-full flex-col gap-px bg-border', className)} role="grid" aria-label="Leave date calendar">
      <div className={cn(uiCalendarGrid, 'shrink-0')}>
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-card py-2 text-center text-[11px] font-medium text-muted-foreground"
            role="columnheader"
          >
            {label}
          </div>
        ))}
      </div>

      <div className={cn(uiCalendarGrid, 'min-h-0 flex-1 auto-rows-fr')}>
        {days.map((day) => {
          const dayStr = formatApiDate(day)
          const inMonth = isSameMonth(day, month)
          const today = isToday(day)
          const dayDisabled = isDayDisabled(day)
          const inRange = isDateInRange(day, from, to)
          const isRangeStart = from && isSameDay(day, from)
          const isRangeEnd = to && isSameDay(day, to)
          const dayEvents = eventsByDate.get(dayStr) ?? []
          const hasExistingLeave = existingLeaveSet.has(dayStr)

          const ariaLabel = `${format(day, 'EEEE, MMMM d, yyyy')}${
            inRange ? ', selected' : ''
          }${dayDisabled ? ', unavailable' : ''}`

          return (
            <button
              key={dayStr}
              type="button"
              role="gridcell"
              disabled={dayDisabled}
              aria-label={ariaLabel}
              aria-selected={inRange}
              onClick={() => handleDayClick(day)}
              className={cn(
                uiCalendarCellBase,
                inMonth ? uiCalendarCellInMonth : uiCalendarCellOutMonth,
                inRange && 'bg-violet-core/15',
                (isRangeStart || isRangeEnd) && 'bg-violet-core/25',
                !dayDisabled && !inRange && 'hover:bg-muted/60',
                dayDisabled && 'cursor-not-allowed opacity-40'
              )}
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    'inline-flex size-7 items-center justify-center text-sm tabular-nums',
                    inMonth ? 'text-foreground' : 'text-muted-foreground/60',
                    today && 'rounded-full bg-red-500 font-medium text-white',
                    inRange && !today && 'text-violet-core font-semibold'
                  )}
                >
                  {formatCellDateLabel(day)}
                </span>
              </div>

              <div className="mt-1 flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.map((event) => (
                  <div
                    key={`${event.date}-${event.label}`}
                    className="flex items-center gap-1 rounded-md bg-violet-core/80 px-1.5 py-0.5 text-[10px] text-white truncate"
                  >
                    <Star className="size-2.5 shrink-0 fill-white" aria-hidden />
                    <span className="truncate">{event.label}</span>
                  </div>
                ))}
                {hasExistingLeave && dayEvents.length === 0 && (
                  <div className="flex items-center gap-1 rounded-md bg-violet-core/20 px-1.5 py-0.5 text-[10px] text-violet-core truncate">
                    <span className="truncate">Existing leave</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
