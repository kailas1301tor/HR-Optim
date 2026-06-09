// components/common/stat-cards.tsx
'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiCardInteractive, uiSkeletonBlock } from '@/lib/ui/design-system'

export interface StatCardItem {
  key: string
  label: string
  count: number
  icon: LucideIcon
  iconClass: string
  activeRing: string
  formatValue?: (count: number) => string
}

interface CommonStatCardsProps {
  items: StatCardItem[]
  activeKey: string
  isLoading?: boolean
  onSelect: (key: string) => void
  className?: string
  columns?: '2' | '3' | '4'
  allowDeselect?: boolean
}

export function CommonStatCards({
  items,
  activeKey,
  isLoading = false,
  onSelect,
  className,
  columns = '3',
  allowDeselect = false,
}: CommonStatCardsProps) {
  const gridClass =
    columns === '4'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-3'

  return (
    <div className={cn('grid gap-4', gridClass, className)}>
      {items.map((card) => {
        const Icon = card.icon
        const isActive = activeKey === card.key
        const displayValue = card.formatValue ? card.formatValue(card.count) : String(card.count)
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(allowDeselect && isActive ? 'all' : card.key)}
            aria-pressed={isActive}
            className={cn(
              uiCardInteractive,
              'p-4 flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
              isActive && card.activeRing
            )}
          >
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">{card.label}</p>
              {isLoading ? (
                <Skeleton className={cn('h-8 w-12 rounded-xl mt-1', uiSkeletonBlock)} />
              ) : (
                <p className="text-2xl font-bold text-cloud font-mono tabular-nums">{displayValue}</p>
              )}
            </div>
            <div className={cn('p-2.5 rounded-xl', card.iconClass)}>
              <Icon className="w-5 h-5" aria-hidden />
            </div>
          </button>
        )
      })}
    </div>
  )
}
