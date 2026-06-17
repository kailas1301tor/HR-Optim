// components/payroll/payroll-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock, uiSquircleSm } from '@/lib/ui/design-system'

export function PayrollCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-5')}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Skeleton className={cn('w-10 h-10 rounded-full shrink-0', uiSkeletonBlock)} />
          <div className="space-y-2 min-w-0">
            <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
          </div>
        </div>
        <Skeleton className={cn('w-16 h-5 rounded-full shrink-0', uiSkeletonBlock)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-20 rounded', uiSkeletonBlock)} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/40">
        <div className="space-y-2">
          <Skeleton className={cn('h-2.5 w-16 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-5 w-24 rounded', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-10 w-20 rounded-xl shrink-0', uiSquircleSm, uiSkeletonBlock)} />
      </div>
    </div>
  )
}
