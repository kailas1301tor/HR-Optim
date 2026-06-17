// components/requests/request-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock, uiSquircleMd, uiSquircleSm } from '@/lib/ui/design-system'

interface RequestCardSkeletonProps {
  showActions?: boolean
}

export function RequestCardSkeleton({ showActions = false }: RequestCardSkeletonProps) {
  return (
    <div className={cn(uiCard, 'overflow-hidden p-4 border-l-2 border-l-border/60')}>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className={cn('h-6 w-6 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <Skeleton className={cn('h-2.5 w-12 rounded', uiSkeletonBlock)} />
            </div>
            <Skeleton className={cn('h-3.5 w-4/5 rounded', uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-5 w-14 rounded-full', uiSkeletonBlock)} />
        </div>

        <div className={cn('overflow-hidden ring-1 ring-border/35', uiSquircleMd)}>
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <Skeleton className={cn('h-7 w-7 shrink-0 rounded-full', uiSkeletonBlock)} />
            <div className="flex-1 space-y-1">
              <Skeleton className={cn('h-3 w-28 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-2.5 w-20 rounded', uiSkeletonBlock)} />
            </div>
          </div>
          <div className="h-px bg-border/50" />
          <Skeleton className={cn('mx-2.5 my-1.5 h-6 w-[calc(100%-1.25rem)] rounded', uiSkeletonBlock)} />
        </div>

        <div className="space-y-1.5">
          <Skeleton className={cn('h-2.5 w-24 rounded', uiSkeletonBlock)} />
          <div className="grid grid-cols-2 gap-1.5">
            <Skeleton className={cn('min-h-11', uiSquircleSm, uiSkeletonBlock)} />
            <Skeleton className={cn('min-h-11', uiSquircleSm, uiSkeletonBlock)} />
          </div>
        </div>

        {showActions ? (
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className={cn('h-9 flex-1 rounded-xl', uiSkeletonBlock)} />
            <Skeleton className={cn('h-9 flex-1 rounded-xl', uiSkeletonBlock)} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
