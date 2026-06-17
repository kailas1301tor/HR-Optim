// components/common/page-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleLg,
  uiSquircleNav,
  uiSquircleSm,
  uiSquircleXs,
} from '@/lib/ui/design-system'

interface CommonPageSkeletonProps {
  className?: string
  showHeader?: boolean
  showStats?: boolean
  showFilters?: boolean
}

export function CommonPageSkeleton({
  className,
  showHeader = true,
  showStats = true,
  showFilters = true,
}: CommonPageSkeletonProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)} aria-label="Loading page content" role="status">
      {showHeader && (
        <div className="space-y-2 pb-2 border-b border-border/40">
          <Skeleton className={cn('h-8 w-48', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-72', uiSquircleNav, uiSkeletonBlock)} />
        </div>
      )}

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(uiCard, 'p-4 flex items-center justify-between')}>
              <div className="space-y-2">
                <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-8 w-12', uiSquircleSm, uiSkeletonBlock)} />
              </div>
              <Skeleton className={cn('w-10 h-10', uiSquircleXs, uiSkeletonBlock)} />
            </div>
          ))}
        </div>
      )}

      {showFilters && (
        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className={cn('h-10 flex-1', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-full lg:w-52', uiSquircleSm, uiSkeletonBlock)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={cn('h-36 w-full', uiSquircleLg, uiSkeletonBlock)} />
        ))}
      </div>
    </div>
  )
}
