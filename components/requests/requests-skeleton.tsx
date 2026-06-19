// components/requests/requests-skeleton.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { CommonMobileCardGrid } from '@/components/common'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiCardInteractive,
  uiSkeletonBlock,
  uiSquircleSm,
  uiSquircleXs,
} from '@/lib/ui/design-system'
import { RequestCardSkeleton } from './request-card-skeleton'

interface RequestsSkeletonProps {
  variant?: 'admin' | 'employee' | 'generic'
  className?: string
}

function RequestsPageHeaderSkeleton() {
  return (
    <div className="pb-4 border-b border-border/40 space-y-2">
      <Skeleton className={cn('h-8 w-32 rounded', uiSkeletonBlock)} />
      <Skeleton className={cn('h-4 w-72 rounded', uiSkeletonBlock)} />
    </div>
  )
}

function RequestsStatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={cn(uiCardInteractive, 'p-4 flex items-center justify-between')}>
          <div className="space-y-2">
            <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-8 w-12', uiSquircleSm, uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('w-10 h-10', uiSquircleXs, uiSkeletonBlock)} />
        </div>
      ))}
    </div>
  )
}

function RequestsFilterChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cn('h-9 w-24 rounded-full shrink-0', uiSkeletonBlock)} />
      ))}
    </div>
  )
}

function EmployeeRequestsHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-cloud">My Requests</h1>
        <p className="text-xs text-muted-foreground mt-1">Submit and track your personal requests</p>
      </div>
      <Skeleton className={cn('h-11 w-36', uiSquircleSm, uiSkeletonBlock)} />
    </div>
  )
}

function AdminRequestsSkeleton({ showEmployeeFilter = true }: { showEmployeeFilter?: boolean }) {
  return (
    <>
      <RequestsPageHeaderSkeleton />
      <RequestsStatCardsSkeleton />
      <div className="space-y-3">
        <RequestsFilterChipsSkeleton />
        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className={cn('h-11 flex-1', uiSquircleSm, uiSkeletonBlock)} />
          {showEmployeeFilter ? (
            <Skeleton className={cn('h-11 w-full lg:w-52', uiSquircleSm, uiSkeletonBlock)} />
          ) : null}
        </div>
      </div>
      <CommonMobileCardGrid className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <RequestCardSkeleton key={index} showActions />
        ))}
      </CommonMobileCardGrid>
    </>
  )
}

function EmployeeRequestsSkeleton() {
  return (
    <>
      <EmployeeRequestsHeaderSkeleton />
      <RequestsFilterChipsSkeleton />
      <CommonMobileCardGrid className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <RequestCardSkeleton key={index} />
        ))}
      </CommonMobileCardGrid>
    </>
  )
}

export function RequestsSkeleton({
  variant = 'generic',
  className,
}: RequestsSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)} aria-label="Loading requests" role="status">
      {variant === 'employee' ? (
        <EmployeeRequestsSkeleton />
      ) : (
        <AdminRequestsSkeleton showEmployeeFilter={variant === 'admin'} />
      )}
    </div>
  )
}
