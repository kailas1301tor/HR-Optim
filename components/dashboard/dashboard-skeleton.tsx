// components/dashboard/dashboard-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleLg,
  uiSquircleSm,
  uiSquircleXs,
} from '@/lib/ui/design-system'

export function DashboardSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-8" aria-label="Loading dashboard" role="status">
      {/* 4 KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={cn(uiCard, 'p-6 space-y-4')}>
            <div className="flex items-center justify-between">
              <Skeleton className={cn('h-4 w-24 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('w-10 h-10', uiSquircleXs, uiSkeletonBlock)} />
            </div>
            <div className="space-y-2">
              <Skeleton className={cn('h-8 w-16', uiSquircleSm, uiSkeletonBlock)} />
              <Skeleton className={cn('h-3 w-32 rounded', uiSkeletonBlock)} />
            </div>
          </div>
        ))}
      </div>

      {/* Middle row: Two charts/heatmap widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(uiCard, 'p-6 space-y-6')}>
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <div className="space-y-1">
              <Skeleton className={cn('h-5 w-40 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-3 w-56 rounded', uiSkeletonBlock)} />
            </div>
          </div>
          <Skeleton className={cn('h-64 w-full', uiSquircleLg, uiSkeletonBlock)} />
        </div>
        <div className={cn(uiCard, 'p-6 space-y-6')}>
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <div className="space-y-1">
              <Skeleton className={cn('h-5 w-48 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-3 w-36 rounded', uiSkeletonBlock)} />
            </div>
          </div>
          <Skeleton className={cn('h-64 w-full', uiSquircleLg, uiSkeletonBlock)} />
        </div>
      </div>

      {/* Bottom row: Document expiry & requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn(uiCard, 'p-6 space-y-6')}>
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <Skeleton className={cn('h-5 w-36 rounded', uiSkeletonBlock)} />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                <div className="space-y-2 flex-1">
                  <Skeleton className={cn('h-4 w-1/2 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-1/4 rounded', uiSkeletonBlock)} />
                </div>
                <Skeleton className={cn('h-6 w-16 rounded-full', uiSkeletonBlock)} />
              </div>
            ))}
          </div>
        </div>
        <div className={cn(uiCard, 'p-6 space-y-6')}>
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <Skeleton className={cn('h-5 w-40 rounded', uiSkeletonBlock)} />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                <div className="space-y-2 flex-1">
                  <Skeleton className={cn('h-4 w-2/3 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-1/3 rounded', uiSkeletonBlock)} />
                </div>
                <Skeleton className={cn('h-8 w-8 rounded-full', uiSkeletonBlock)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
