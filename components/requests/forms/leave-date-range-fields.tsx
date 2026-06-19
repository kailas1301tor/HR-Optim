// components/requests/forms/leave-date-range-fields.tsx
'use client'

import { parseISO, startOfToday } from 'date-fns'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'

interface LeaveDateRangeFieldsProps {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  className?: string
}

export function LeaveDateRangeFields({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className,
}: LeaveDateRangeFieldsProps) {
  const today = startOfToday()

  // Parse strings to Dates safely
  const parsedFromDate = fromDate ? parseISO(fromDate) : undefined

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
          disabledDays={{ before: today }}
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
          disabledDays={{ before: parsedFromDate || today }}
        />
      </div>
    </div>
  )
}
