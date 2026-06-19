// components/ui/date-picker.tsx
'use client'

import * as React from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { uiSquircleSm } from '@/lib/ui/design-system'

export interface DatePickerProps {
  value?: Date | string | null
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  disabledDays?: React.ComponentProps<typeof Calendar>['disabled']
  /** Earliest selectable year in the dropdown (default: 100 years ago). */
  fromYear?: number
  /** Latest selectable year in the dropdown (default: current year + 5, or current year when disableFuture). */
  toYear?: number
  /** When true, caps the year dropdown at the current year and disables future dates. */
  disableFuture?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  id,
  disabledDays,
  fromYear,
  toYear,
  disableFuture = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const today = React.useMemo(() => new Date(), [])

  const calendarBounds = React.useMemo(() => {
    const currentYear = today.getFullYear()
    const resolvedFromYear = fromYear ?? currentYear - 100
    const resolvedToYear =
      toYear ?? (disableFuture ? currentYear : currentYear + 5)

    return {
      startMonth: new Date(resolvedFromYear, 0),
      endMonth: new Date(resolvedToYear, 11),
    }
  }, [disableFuture, fromYear, toYear, today])

  const resolvedDisabledDays = React.useMemo(() => {
    if (!disableFuture) return disabledDays

    const futureMatcher = { after: today }
    if (!disabledDays) return futureMatcher
    if (Array.isArray(disabledDays)) return [...disabledDays, futureMatcher]
    return [disabledDays, futureMatcher]
  }, [disableFuture, disabledDays, today])

  // Normalize value to a Date object
  const date = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) {
      return isValid(value) ? value : undefined
    }
    // If it's a string, try parsing it
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : undefined
  }, [value])

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      setOpen(false)
      if (onChange) {
        if (selectedDate) {
          // Format as YYYY-MM-DD for standard backend / validation support
          const formatted = format(selectedDate, 'yyyy-MM-dd')
          onChange(formatted)
        } else {
          onChange('')
        }
      }
    },
    [onChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          disabled={disabled}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-10 px-3 text-xs border border-border bg-input/30 hover:bg-input/50 text-foreground transition-all duration-200 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 disabled:pointer-events-none',
            uiSquircleSm,
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary shrink-0" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date || today}
          disabled={resolvedDisabledDays}
          captionLayout="dropdown"
          reverseYears
          startMonth={calendarBounds.startMonth}
          endMonth={calendarBounds.endMonth}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
