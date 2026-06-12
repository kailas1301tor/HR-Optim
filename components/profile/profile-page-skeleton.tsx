// components/profile/profile-page-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className={cn(uiSkeletonBlock, 'h-5 w-24 rounded-xl')} />
        <div className={cn('overflow-hidden border border-border/60', uiSquircleMd)}>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className={cn(uiSkeletonBlock, 'w-24 h-24 rounded-2xl shrink-0')} />
              <div className="flex-1 space-y-3">
                <Skeleton className={cn(uiSkeletonBlock, 'h-7 w-40 rounded-xl')} />
                <Skeleton className={cn(uiSkeletonBlock, 'h-4 w-56 rounded-xl')} />
                <Skeleton className={cn(uiSkeletonBlock, 'h-3 w-16 rounded-xl')} />
              </div>
            </div>
          </div>
          <div className="p-8 pt-0 grid gap-3 sm:grid-cols-2">
            <Skeleton className={cn(uiSkeletonBlock, 'h-20 w-full rounded-2xl')} />
            <Skeleton className={cn(uiSkeletonBlock, 'h-20 w-full rounded-2xl')} />
            <Skeleton className={cn(uiSkeletonBlock, 'h-20 w-full rounded-2xl sm:col-span-2')} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className={cn(uiSkeletonBlock, 'h-5 w-32 rounded-xl')} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className={cn(uiSkeletonBlock, 'h-20 w-full rounded-2xl')} />
          <Skeleton className={cn(uiSkeletonBlock, 'h-20 w-full rounded-2xl')} />
        </div>
      </div>
    </div>
  )
}
