// components/reports/reports-chart-card.tsx
'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonEmptyState } from '@/components/common'
import { reportsChartShell, uiCard, uiSkeletonBlock, uiSquircleLg } from '@/lib/ui/design-system'
import { BarChart3 } from 'lucide-react'

interface ReportsChartCardProps {
  title: string
  subtitle?: string
  isLoading?: boolean
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  children: ReactNode
  className?: string
}

export function ReportsChartCard({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'Report data is not available for this period.',
  children,
  className,
}: ReportsChartCardProps) {
  return (
    <div className={cn(uiCard, 'p-6', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-cloud">{title}</h3>
        {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
      </div>

      {isLoading ? (
        <Skeleton className={cn('h-[320px] w-full', uiSquircleLg, uiSkeletonBlock)} />
      ) : isEmpty ? (
        <CommonEmptyState icon={BarChart3} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className={reportsChartShell}>{children}</div>
      )}
    </div>
  )
}
