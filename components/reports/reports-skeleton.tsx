// components/reports/reports-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleLg,
  uiSquircleSm,
  uiSquircleXs,
} from '@/lib/ui/design-system'

function ReportsKpiCardSkeleton({ showGrowth = true }: { showGrowth?: boolean }) {
  return (
    <div className={cn(uiCard, 'p-4')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className={cn('h-3 w-24 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-8 w-16', uiSquircleSm, uiSkeletonBlock)} />
          {showGrowth ? (
            <Skeleton className={cn('h-3 w-28 rounded', uiSkeletonBlock)} />
          ) : null}
        </div>
        <Skeleton className={cn('w-10 h-10 shrink-0', uiSquircleXs, uiSkeletonBlock)} />
      </div>
    </div>
  )
}

function ReportsChartCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-6')}>
      <div className="mb-6 space-y-2">
        <Skeleton className={cn('h-5 w-40 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3 w-56 rounded', uiSkeletonBlock)} />
      </div>
      <Skeleton className={cn('h-[280px] w-full', uiSquircleLg, uiSkeletonBlock)} />
    </div>
  )
}

export function ReportsSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading reports" role="status">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-2">
          <Skeleton className={cn('h-8 w-48 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-72 rounded', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-10 w-10 rounded-xl', uiSkeletonBlock)} />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className={cn('h-9 w-24 rounded-xl shrink-0', uiSkeletonBlock)} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ReportsKpiCardSkeleton key={index} />
        ))}
        <ReportsKpiCardSkeleton showGrowth={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChartCardSkeleton />
        <ReportsChartCardSkeleton />
      </div>
    </div>
  )
}
