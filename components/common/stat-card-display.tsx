// components/common/stat-card-display.tsx
'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiCardInteractive, uiSkeletonBlock, uiSquircleSm, uiSquircleXs } from '@/lib/ui/design-system'

export interface StatDisplayItem {
  key: string
  label: string
  icon: LucideIcon
  iconClass: string
  displayValue: ReactNode
}

interface CommonStatCardDisplayProps {
  items: StatDisplayItem[]
  isLoading?: boolean
  className?: string
  columns?: '2' | '3' | '4'
}

export function CommonStatCardDisplay({
  items,
  isLoading = false,
  className,
  columns = '3',
}: CommonStatCardDisplayProps) {
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
        return (
          <div
            key={card.key}
            className={cn(
              uiCardInteractive,
              'p-4 flex items-center justify-between hover:scale-[1.01]'
            )}
          >
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">{card.label}</p>
              {isLoading ? (
                <Skeleton className={cn('h-8 w-16 mt-1', uiSquircleSm, uiSkeletonBlock)} />
              ) : (
                <p className="text-2xl font-bold text-cloud font-mono tabular-nums">{card.displayValue}</p>
              )}
            </div>
            <div className={cn('p-2.5', uiSquircleXs, card.iconClass)}>
              <Icon className="w-5 h-5" aria-hidden />
            </div>
          </div>
        )
      })}
    </div>
  )
}
