// components/attendance/attendance-date-nav.tsx
'use client'

import { useState } from 'react'
import { isSameDay, startOfToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  uiOutlineBtn,
  uiTabChipActive,
  uiTabChipBase,
} from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface AttendanceDateNavProps {
  selectedDate: Date
  formattedDate: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onDateSelect: (date: Date) => void
}

export function AttendanceDateNav({
  selectedDate,
  formattedDate,
  onPrevious,
  onNext,
  onToday,
  onDateSelect,
}: AttendanceDateNavProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const isToday = isSameDay(selectedDate, startOfToday())

  const handleCalendarSelect = (date: Date | undefined): void => {
    if (!date) return
    onDateSelect(date)
    setIsCalendarOpen(false)
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="min-h-11 min-w-11"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 px-4 py-2 bg-midnight rounded-[20px] [corner-shape:squircle] min-h-11',
                'border transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isToday
                  ? 'border-violet-core/30 shadow-[0_0_12px_rgba(139,92,246,0.12)]'
                  : 'border-transparent hover:border-border/60',
              )}
              aria-label={`Selected date: ${formattedDate}. Open calendar to choose a date.`}
              aria-pressed={isToday}
            >
              <CalendarIcon className="w-4 h-4 text-violet-glow shrink-0" aria-hidden />
              <span className="text-sm font-medium text-cloud">{formattedDate}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              defaultMonth={selectedDate}
              captionLayout="dropdown"
              reverseYears
              startMonth={new Date(new Date().getFullYear() - 10, 0)}
              endMonth={new Date(new Date().getFullYear() + 1, 11)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="min-h-11 min-w-11"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

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
  )
}
