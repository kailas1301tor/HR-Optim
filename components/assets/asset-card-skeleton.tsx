// components/assets/asset-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function AssetCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-5 space-y-4')}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className={cn('w-10 h-10 rounded-xl', uiSkeletonBlock)} />
          <div className="space-y-2">
            <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
          </div>
        </div>
        <Skeleton className={cn('w-16 h-5 rounded-full', uiSkeletonBlock)} />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <Skeleton className={cn('h-3 w-20 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-4 w-16 rounded', uiSkeletonBlock)} />
      </div>
    </div>
  )
}
