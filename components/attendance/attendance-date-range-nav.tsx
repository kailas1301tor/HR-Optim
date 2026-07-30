// components/attendance/attendance-date-range-nav.tsx
'use client'

import { isSameDay, startOfToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import {
  uiOutlineBtn,
  uiTabChipActive,
  uiTabChipBase,
} from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { isValid } from 'date-fns'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function parsePickerDate(value: string): Date | null {
  if (!value) return null
  const parsed = parseApiDate(value)
  if (!parsed || !isValid(parsed)) return null
  return parsed
}

interface AttendanceDateRangeNavProps {
  startDate: Date
  endDate: Date
  rangeLabel: string
  isRangeMode: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onDateRangeChange: (start: Date, end: Date) => void
}

export function AttendanceDateRangeNav({
  startDate,
  endDate,
  rangeLabel,
  isRangeMode,
  onPrevious,
  onNext,
  onToday,
  onDateRangeChange,
}: AttendanceDateRangeNavProps) {
  const isToday = isSameDay(startDate, startOfToday()) && isSameDay(endDate, startOfToday())

  const handleStartChange = (value: string): void => {
    const nextStart = parsePickerDate(value)
    if (!nextStart) return

    const safeEnd = isValid(endDate) ? endDate : nextStart
    const nextEnd = safeEnd < nextStart ? nextStart : safeEnd
    onDateRangeChange(nextStart, nextEnd)
  }

  const handleEndChange = (value: string): void => {
    const nextEnd = parsePickerDate(value)
    if (!nextEnd) return

    const safeStart = isValid(startDate) ? startDate : nextEnd
    const nextStart = nextEnd < safeStart ? nextEnd : safeStart
    onDateRangeChange(nextStart, nextEnd)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="min-h-11 min-w-11"
          aria-label={isRangeMode ? 'Previous period' : 'Previous day'}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div
          className={cn(
            'flex items-center px-4 py-2 bg-midnight rounded-[20px] [corner-shape:squircle] min-h-11',
            'border transition-all duration-200',
            isToday
              ? 'border-violet-core/30 shadow-[0_0_12px_rgba(139,92,246,0.12)]'
              : 'border-transparent',
          )}
          aria-label={`Selected range: ${rangeLabel}`}
        >
          <span className="text-sm font-medium text-cloud">{rangeLabel}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="min-h-11 min-w-11"
          aria-label={isRangeMode ? 'Next period' : 'Next day'}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          disabled={isToday}
          aria-pressed={isToday}
          aria-label={isToday ? 'Viewing today' : 'Go to today'}
          className={cn(
            'min-h-11',
            isToday
              ? cn(
                  uiTabChipBase,
                  uiTabChipActive,
                  'disabled:opacity-100 disabled:pointer-events-none disabled:cursor-default',
                )
              : uiOutlineBtn,
          )}
        >
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="attendance-start-date" className="text-xs text-muted-foreground">
            Start Date
          </Label>
          <DatePicker
            id="attendance-start-date"
            value={formatApiDate(startDate)}
            onChange={handleStartChange}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="attendance-end-date" className="text-xs text-muted-foreground">
            End Date
          </Label>
          <DatePicker
            id="attendance-end-date"
            value={formatApiDate(endDate)}
            onChange={handleEndChange}
            disabledDays={{ before: startDate }}
          />
        </div>
      </div>
    </div>
  )
}
