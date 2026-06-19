// components/attendance/attendance-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function AttendanceCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-5')}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Skeleton className={cn('w-10 h-10 rounded-full shrink-0 mt-0.5', uiSkeletonBlock)} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className={cn('h-4.5 w-24 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-4 w-12 rounded', uiSkeletonBlock)} />
            </div>
            <Skeleton className={cn('h-3.5 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-40 rounded', uiSkeletonBlock)} />
          </div>
        </div>
        <Skeleton className={cn('w-16 h-5 rounded-full shrink-0', uiSkeletonBlock)} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Skeleton className={cn('w-2.5 h-2.5 rounded-full shrink-0', uiSkeletonBlock)} />
        <Skeleton className={cn('h-4 w-16 rounded', uiSkeletonBlock)} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
        <div className="space-y-1.5">
          <Skeleton className={cn('h-3 w-12 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-16 rounded', uiSkeletonBlock)} />
        </div>
        <div className="space-y-1.5">
          <Skeleton className={cn('h-3 w-14 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-16 rounded', uiSkeletonBlock)} />
        </div>
        <div className="col-span-2 space-y-1.5 mt-1">
          <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-12 rounded', uiSkeletonBlock)} />
        </div>
      </div>
    </div>
  )
}
