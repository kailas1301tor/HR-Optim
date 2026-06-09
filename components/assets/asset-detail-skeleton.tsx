// components/assets/asset-detail-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function AssetDetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading asset details" role="status">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Skeleton className={cn('h-9 w-28 rounded-xl', uiSkeletonBlock)} />
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Skeleton className={cn('h-10 w-24 rounded-xl', uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-10 rounded-xl', uiSkeletonBlock)} />
        </div>
      </div>

      <div className={cn(uiCard, 'p-6 shadow-xl relative overflow-hidden')}>
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-core/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className={cn('w-14 h-14 rounded-2xl', uiSkeletonBlock)} />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className={cn('h-6 w-40 rounded-xl', uiSkeletonBlock)} />
                <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
              </div>
              <Skeleton className={cn('h-4 w-32 rounded-xl', uiSkeletonBlock)} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-5 w-24 rounded-xl', uiSkeletonBlock)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex border-b border-border/60 overflow-x-auto no-scrollbar gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-3 border-b-2 border-transparent">
            <Skeleton className={cn('h-5 w-24 rounded-xl', uiSkeletonBlock)} />
          </div>
        ))}
      </div>

      <div className="min-h-[250px] p-6 bg-card/20 border border-border/40 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col} className="space-y-4">
              <Skeleton className={cn('h-5 w-32 rounded-xl', uiSkeletonBlock)} />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/20">
                    <Skeleton className={cn('h-4 w-24 rounded', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-4 w-36 rounded', uiSkeletonBlock)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
