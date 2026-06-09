// components/common/filter-chips.tsx
'use client'

import { cn } from '@/lib/utils'
import { uiFilterChipActive, uiFilterChipBase, uiFilterChipInactive } from '@/lib/ui/design-system'

export interface FilterChipOption {
  value: string
  label: string
}

interface CommonFilterChipsProps {
  options: FilterChipOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CommonFilterChips({ options, value, onChange, className }: CommonFilterChipsProps) {
  return (
    <div className={cn('flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5', className)} role="tablist">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(uiFilterChipBase, isActive ? uiFilterChipActive : uiFilterChipInactive)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
