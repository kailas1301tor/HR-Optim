// components/attendance/attendance-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function AttendanceCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-5 space-y-4')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className={cn('w-10 h-10 rounded-full shrink-0', uiSkeletonBlock)} />
          <div className="space-y-2">
            <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-24 rounded', uiSkeletonBlock)} />
          </div>
        </div>
        <Skeleton className={cn('w-16 h-5 rounded-full', uiSkeletonBlock)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className={cn('h-3 w-full rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3 w-full rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3 w-full rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3 w-full rounded', uiSkeletonBlock)} />
      </div>
    </div>
  )
}
