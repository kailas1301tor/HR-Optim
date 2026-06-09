// components/requests/request-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function RequestCardSkeleton() {
  return (
    <div className={cn(uiCard, 'overflow-hidden border-l-2 border-l-border/40 p-5 space-y-4')}>
      <div className="flex items-start gap-4">
        <Skeleton className={cn('w-10 h-10 rounded-full shrink-0', uiSkeletonBlock)} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className={cn('w-8 h-8 rounded-xl', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-3 w-40 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-full rounded', uiSkeletonBlock)} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <Skeleton className={cn('h-3 w-24 rounded', uiSkeletonBlock)} />
        <div className="flex gap-2">
          <Skeleton className={cn('h-10 w-20 rounded-xl', uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-24 rounded-xl', uiSkeletonBlock)} />
        </div>
      </div>
    </div>
  )
}
