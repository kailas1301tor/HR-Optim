// components/documents/document-card-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'

export function DocumentCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-5 border-l-2 border-l-border/40 space-y-4')}>
      <div className="flex items-start justify-between">
        <Skeleton className={cn('w-10 h-10 rounded-xl', uiSkeletonBlock)} />
        <Skeleton className={cn('w-16 h-5 rounded-full', uiSkeletonBlock)} />
      </div>
      <div className="space-y-2">
        <Skeleton className={cn('h-4 w-3/4 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3.5 w-1/2 rounded', uiSkeletonBlock)} />
      </div>
      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
        <Skeleton className={cn('h-3 w-12 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-3 w-20 rounded', uiSkeletonBlock)} />
      </div>
    </div>
  )
}
