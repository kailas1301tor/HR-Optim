// components/profile/profile-page-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiSquircleLg } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

function ProfileDetailFieldSkeleton({ className }: { className?: string }): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border border-transparent p-3.5',
        className
      )}
    >
      <Skeleton className={cn('h-9 w-9 shrink-0 rounded-lg', uiSkeletonBlock)} />
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        <Skeleton className={cn('h-2.5 w-16 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-4 w-full max-w-[180px] rounded', uiSkeletonBlock)} />
      </div>
    </div>
  )
}

function ProfileQuickActionRowSkeleton(): React.JSX.Element {
  return (
    <div className="flex min-h-12 items-center justify-between rounded-xl border border-transparent p-2.5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <Skeleton className={cn('h-9 w-9 shrink-0 rounded-lg', uiSkeletonBlock)} />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className={cn('h-3.5 w-24 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-3 w-40 max-w-full rounded', uiSkeletonBlock)} />
        </div>
      </div>
      <Skeleton className={cn('h-4 w-4 shrink-0 rounded', uiSkeletonBlock)} />
    </div>
  )
}

export function ProfilePageSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-8" aria-label="Loading profile" role="status">
      {/* Flat Header Skeleton */}
      <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border/40 pb-6">
        <Skeleton className={cn('h-20 w-20 sm:h-24 sm:w-24 shrink-0 ring-2 ring-border/20 z-10', uiSquircleLg, uiSkeletonBlock)} />
        <div className="min-w-0 flex-1 space-y-2.5 py-1">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className={cn('h-7 w-40 max-w-full rounded-lg sm:h-8', uiSkeletonBlock)} />
            <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className={cn('h-4.5 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-28 rounded', uiSkeletonBlock)} />
          </div>
        </div>
      </div>

      {/* Split-pane grid layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details Panel Skeleton */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Header Skeleton */}
          <div className="flex border-b border-border/40 gap-4 overflow-x-auto pb-1">
            <Skeleton className={cn('h-8 w-28 rounded-t-lg', uiSkeletonBlock)} />
            <Skeleton className={cn('h-8 w-28 rounded-t-lg', uiSkeletonBlock)} />
            <Skeleton className={cn('h-8 w-28 rounded-t-lg', uiSkeletonBlock)} />
          </div>
          {/* Fields Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 pt-2">
            <ProfileDetailFieldSkeleton />
            <ProfileDetailFieldSkeleton />
            <ProfileDetailFieldSkeleton />
            <ProfileDetailFieldSkeleton />
            <ProfileDetailFieldSkeleton />
            <ProfileDetailFieldSkeleton />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-border/30 lg:pl-8">
          {/* Status Block Skeleton */}
          <div className="space-y-4">
            <div className="border-b border-border/40 pb-2">
              <Skeleton className={cn('h-3.5 w-28 rounded', uiSkeletonBlock)} />
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <Skeleton className={cn('h-3.5 w-24 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-3.5 w-16 rounded', uiSkeletonBlock)} />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className={cn('h-3.5 w-20 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-3.5 w-20 rounded', uiSkeletonBlock)} />
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <section className="space-y-4">
            <div className="border-b border-border/40 pb-2">
              <Skeleton className={cn('h-3.5 w-24 rounded', uiSkeletonBlock)} />
            </div>
            <div className="space-y-2">
              <ProfileQuickActionRowSkeleton />
              <ProfileQuickActionRowSkeleton />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

