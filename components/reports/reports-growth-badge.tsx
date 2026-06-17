// components/reports/reports-growth-badge.tsx
'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatGrowthLabel } from '@/lib/mappers/reports-mapper'

interface ReportsGrowthBadgeProps {
  percentage: number
  className?: string
}

export function ReportsGrowthBadge({ percentage, className }: ReportsGrowthBadgeProps) {
  const isPositive = percentage >= 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        isPositive ? 'text-lime-400' : 'text-red-400',
        className,
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
      ) : (
        <TrendingDown className="h-3 w-3 shrink-0" aria-hidden />
      )}
      <span>{formatGrowthLabel(percentage)} vs last period</span>
    </span>
  )
}
