// components/requests/request-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock, uiSquircleLg, uiSquircleMd, uiSquircleSm } from '@/lib/ui/design-system'

export function RequestCardSkeleton() {
  return (
    <div
      className={cn(
        'overflow-hidden border border-border/45 bg-card/92 p-4',
        uiSquircleLg,
        'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.06)]'
      )}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Skeleton className={cn('h-7 w-7 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <Skeleton className={cn('h-2.5 w-12 rounded', uiSkeletonBlock)} />
            </div>
            <Skeleton className={cn('h-4 w-4/5 rounded', uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-5 w-14 rounded-full', uiSkeletonBlock)} />
        </div>
        <div className={cn('overflow-hidden ring-1 ring-border/35', uiSquircleMd)}>
          <div className="flex items-center gap-2.5 p-3">
            <Skeleton className={cn('h-8 w-8 shrink-0 rounded-full', uiSkeletonBlock)} />
            <div className="flex-1 space-y-1">
              <Skeleton className={cn('h-3.5 w-28 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-2.5 w-20 rounded', uiSkeletonBlock)} />
            </div>
          </div>
          <div className="h-px bg-border/50" />
          <Skeleton className={cn('m-3 h-8 w-[calc(100%-1.5rem)] rounded', uiSkeletonBlock)} />
        </div>
        <div className="space-y-2">
          <Skeleton className={cn('h-2.5 w-24 rounded', uiSkeletonBlock)} />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className={cn('h-10', uiSquircleSm, uiSkeletonBlock)} />
            <Skeleton className={cn('h-10', uiSquircleSm, uiSkeletonBlock)} />
          </div>
        </div>
      </div>
    </div>
  )
}
