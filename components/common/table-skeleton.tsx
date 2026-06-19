// components/common/table-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiTableShell,
  uiSquircleSm,
  uiSquircleXs,
  uiSquircleNav,
} from '@/lib/ui/design-system'

interface TableSkeletonProps {
  className?: string
  showHeader?: boolean
  showStats?: boolean
  showFilters?: boolean
  showFilterChips?: boolean
  filterChipCount?: number
}

export function TableSkeleton({
  className,
  showHeader = true,
  showStats = true,
  showFilters = true,
  showFilterChips = false,
  filterChipCount = 3,
}: TableSkeletonProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)} aria-label="Loading list content" role="status">
      {showHeader && (
        <div className="space-y-2 pb-2 border-b border-border/40">
          <Skeleton className={cn('h-8 w-48', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-72', uiSquircleNav, uiSkeletonBlock)} />
        </div>
      )}

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

      {showFilterChips ? (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {Array.from({ length: filterChipCount }).map((_, index) => (
            <Skeleton key={index} className={cn('h-9 w-24 rounded-full shrink-0', uiSkeletonBlock)} />
          ))}
        </div>
      ) : null}

      {showFilters && (
        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className={cn('h-10 flex-1', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-full lg:w-52', uiSquircleSm, uiSkeletonBlock)} />
        </div>
      )}

      {/* Mobile Card Grid Loader Fallback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className={cn(uiCard, 'p-5 space-y-4')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className={cn('w-10 h-10 rounded-full shrink-0', uiSkeletonBlock)} />
                <div className="space-y-2">
                  <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
                </div>
              </div>
              <Skeleton className={cn('w-16 h-5 rounded-full', uiSkeletonBlock)} />
            </div>
            <Skeleton className={cn('h-3 w-24 rounded', uiSkeletonBlock)} />
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <Skeleton className={cn('h-3.5 w-20 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-3.5 w-16 rounded', uiSkeletonBlock)} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Shell Loader Fallback */}
      <div className={cn(uiTableShell, 'hidden lg:block')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className={cn('h-3 rounded w-16', uiSkeletonBlock)} />
                  </th>
                ))}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className={cn('w-9 h-9 rounded-full shrink-0', uiSkeletonBlock)} />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className={cn('h-3 rounded w-24', uiSkeletonBlock)} />
                        <Skeleton className={cn('h-2 rounded w-16', uiSkeletonBlock)} />
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className={cn('h-4 rounded w-20', uiSkeletonBlock)} />
                    </td>
                  ))}
                  <td className="px-4 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
