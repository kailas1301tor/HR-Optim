// components/common/list-toolbar.tsx
'use client'

import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { uiInput } from '@/lib/ui/design-system'

interface CommonListToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
  filters?: ReactNode
  chips?: ReactNode
  actions?: ReactNode
  className?: string
}

export function CommonListToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchAriaLabel = 'Search',
  filters,
  chips,
  actions,
  className,
}: CommonListToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(uiInput, 'pl-9 w-full text-xs')}
              aria-label={searchAriaLabel}
            />
          </div>
          {filters}
        </div>
        {actions && <div className="flex items-center gap-2 justify-end shrink-0">{actions}</div>}
      </div>
      {chips}
    </div>
  )
}
