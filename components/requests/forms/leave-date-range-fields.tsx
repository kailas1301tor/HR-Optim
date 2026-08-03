// components/requests/forms/leave-date-range-fields.tsx
'use client'

import { useMemo } from 'react'
import { parseISO, startOfToday, subDays } from 'date-fns'
import type { Matcher } from 'react-day-picker'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import {
  buildBlockedDateSet,
  toDatePickerDisabledMatchers,
} from '@/lib/helpers/calendar-blocked-dates'

/** Maximum number of days in the past an employee can backdate a leave request. */
const LEAVE_BACKDATE_LIMIT_DAYS = 30

interface LeaveDateRangeFieldsProps {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  blockedDates?: Date[]
  className?: string
}

export function LeaveDateRangeFields({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  blockedDates = [],
  className,
}: LeaveDateRangeFieldsProps) {
  const today = startOfToday()
  const earliestAllowedDate = subDays(today, LEAVE_BACKDATE_LIMIT_DAYS)

  const parsedFromDate = fromDate ? parseISO(fromDate) : undefined

  const disabledMatchers = useMemo((): Matcher | Matcher[] => {
    const blocked = toDatePickerDisabledMatchers(buildBlockedDateSet(blockedDates))
    const beforeEarliest = { before: earliestAllowedDate }
    return blocked.length > 0 ? [beforeEarliest, ...blocked] : beforeEarliest
  }, [blockedDates, earliestAllowedDate])

  const endDisabledMatchers = useMemo((): Matcher | Matcher[] => {
    const blocked = toDatePickerDisabledMatchers(buildBlockedDateSet(blockedDates))
    const beforeStart = { before: parsedFromDate || earliestAllowedDate }
    return blocked.length > 0 ? [beforeStart, ...blocked] : beforeStart
  }, [blockedDates, earliestAllowedDate, parsedFromDate])

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <div className="space-y-1.5">
        <Label htmlFor="leave-start-date" className="text-xs text-muted-foreground">
          Start Date
        </Label>
        <DatePicker
          id="leave-start-date"
          value={fromDate}
          onChange={onFromDateChange}
          disabledDays={disabledMatchers}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="leave-end-date" className="text-xs text-muted-foreground">
          End Date
        </Label>
        <DatePicker
          id="leave-end-date"
          value={toDate}
          onChange={onToDateChange}
          disabledDays={endDisabledMatchers}
        />
      </div>
    </div>
  )
}
