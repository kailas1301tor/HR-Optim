// components/requests/forms/leave-date-range-fields.tsx
'use client'

import { CalendarDays } from 'lucide-react'
import { format, startOfToday } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { uiInput } from '@/lib/ui/design-system'

interface LeaveDateRangeFieldsProps {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  className?: string
}

const todayMin = format(startOfToday(), 'yyyy-MM-dd')

export function LeaveDateRangeFields({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className,
}: LeaveDateRangeFieldsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      <div className="space-y-1.5">
        <Label htmlFor="leave-start-date" className="text-xs text-muted-foreground">
          Start Date
        </Label>
        <div className="relative">
          <CalendarDays
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="leave-start-date"
            type="date"
            min={todayMin}
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className={cn(uiInput, 'h-10 pl-9 text-xs')}
            aria-label="Leave start date"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="leave-end-date" className="text-xs text-muted-foreground">
          End Date
        </Label>
        <div className="relative">
          <CalendarDays
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="leave-end-date"
            type="date"
            min={fromDate || todayMin}
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className={cn(uiInput, 'h-10 pl-9 text-xs')}
            aria-label="Leave end date"
          />
        </div>
      </div>
    </div>
  )
}
