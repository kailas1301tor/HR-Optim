// components/profile/profile-page-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

function ProfileDetailFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-3 py-2 px-1', className)}>
      <Skeleton className={cn('w-4 h-4 shrink-0 mt-0.5 rounded', uiSkeletonBlock)} />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className={cn('h-2.5 w-20 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-4 w-full max-w-[200px] rounded', uiSkeletonBlock)} />
      </div>
    </div>
  )
}

function ProfileSectionSkeleton({
  fieldCount,
  lastFieldSpan = false,
}: {
  fieldCount: number
  lastFieldSpan?: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-border/30">
        <Skeleton className={cn('h-3 w-40 rounded', uiSkeletonBlock)} />
      </div>
      <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <ProfileDetailFieldSkeleton
            key={index}
            className={lastFieldSpan && index === fieldCount - 1 ? 'sm:col-span-2' : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function ProfileQuickActionRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 px-2">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <Skeleton className={cn('w-8 h-8 shrink-0 rounded-lg', uiSkeletonBlock)} />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-3 w-48 max-w-full rounded', uiSkeletonBlock)} />
        </div>
      </div>
      <Skeleton className={cn('w-4 h-4 shrink-0 rounded', uiSkeletonBlock)} />
    </div>
  )
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading profile" role="status">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border/30">
        <Skeleton className={cn('w-28 h-28 shrink-0 rounded-2xl', uiSquircleMd, uiSkeletonBlock)} />
        <div className="space-y-2 text-center sm:text-left min-w-0 flex-1 mt-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
            <Skeleton className={cn('h-8 w-48 max-w-full rounded-xl', uiSkeletonBlock)} />
            <Skeleton className={cn('h-6 w-16 rounded-full mx-auto sm:mx-0', uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-5 w-36 max-w-full rounded-xl mx-auto sm:mx-0', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-28 max-w-full rounded-xl mx-auto sm:mx-0', uiSkeletonBlock)} />
        </div>
      </div>

      <div className="space-y-8">
        <ProfileSectionSkeleton fieldCount={3} />
        <ProfileSectionSkeleton fieldCount={6} />
        <ProfileSectionSkeleton fieldCount={5} lastFieldSpan />
      </div>

      <div className="space-y-4">
        <div className="pb-2 border-b border-border/30">
          <Skeleton className={cn('h-3 w-28 rounded', uiSkeletonBlock)} />
        </div>
        <div className="divide-y divide-border/20">
          <ProfileQuickActionRowSkeleton />
          <ProfileQuickActionRowSkeleton />
        </div>
      </div>
    </div>
  )
}
