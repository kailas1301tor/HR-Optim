// components/common/month-year-picker.tsx
'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

const MONTH_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

function buildYearOptions(): number[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index)
}

export interface MonthYearPickerProps {
  month: number
  year: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  className?: string
}

export function MonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
  className,
}: MonthYearPickerProps) {
  const yearOptions = buildYearOptions()

  return (
    <div className={cn('flex flex-wrap items-end gap-4', className)}>
      <div className="space-y-1.5 min-w-[140px]">
        <Label className="text-xs text-muted-foreground">Month</Label>
        <Select
          value={String(month)}
          onValueChange={(value) => onMonthChange(Number(value))}
        >
          <SelectTrigger className={cn(uiSelect, 'min-h-10 text-xs')}>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 min-w-[120px]">
        <Label className="text-xs text-muted-foreground">Year</Label>
        <Select
          value={String(year)}
          onValueChange={(value) => onYearChange(Number(value))}
        >
          <SelectTrigger className={cn(uiSelect, 'min-h-10 text-xs')}>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((optionYear) => (
              <SelectItem key={optionYear} value={String(optionYear)}>
                {optionYear}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
