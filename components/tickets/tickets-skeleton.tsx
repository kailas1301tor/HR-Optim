// components/tickets/tickets-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { CommonMobileCardGrid } from '@/components/common'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiTableShell,
} from '@/lib/ui/design-system'

interface TicketsSkeletonProps {
  className?: string
  showHeader?: boolean
}

function HelpSupportSectionSkeleton() {
  return (
    <div className={cn(uiCard, 'overflow-hidden p-0')} aria-hidden>
      <div className="border-b border-border/50 px-5 py-4 flex items-start gap-3">
        <Skeleton className={cn('h-10 w-10 rounded-xl shrink-0', uiSkeletonBlock)} />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className={cn('h-4 w-32 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-3 w-56 max-w-full rounded', uiSkeletonBlock)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className={cn('h-10 w-10 rounded-xl shrink-0', uiSkeletonBlock)} />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className={cn('h-3 w-14 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-4 w-40 rounded', uiSkeletonBlock)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TicketsFilterChipsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className={cn('h-9 w-20 rounded-xl shrink-0', uiSkeletonBlock)} />
      ))}
    </div>
  )
}

function TicketCardSkeleton() {
  return (
    <div className={cn(uiCard, 'p-4 space-y-3')}>
      <div className="flex items-start justify-between gap-2">
        <Skeleton className={cn('h-4 w-2/3 rounded', uiSkeletonBlock)} />
        <div className="flex shrink-0 gap-1">
          <Skeleton className={cn('h-5 w-14 rounded-full', uiSkeletonBlock)} />
          <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
        </div>
      </div>
      <Skeleton className={cn('h-3 w-full rounded', uiSkeletonBlock)} />
      <Skeleton className={cn('h-3 w-4/5 rounded', uiSkeletonBlock)} />
    </div>
  )
}

function TicketsTableSkeleton() {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block overflow-x-auto')}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <th key={index} className="px-4 py-3 text-left">
                <Skeleton className={cn('h-3 rounded w-16', uiSkeletonBlock)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/50">
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <Skeleton className={cn('h-4 w-48 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-64 max-w-full rounded', uiSkeletonBlock)} />
                </div>
              </td>
              {Array.from({ length: 3 }).map((_, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TicketsContentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className={cn('h-11 w-full rounded-xl', uiSkeletonBlock)} />
      <TicketsFilterChipsSkeleton />
      <TicketsTableSkeleton />
      <CommonMobileCardGrid className="lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <TicketCardSkeleton key={index} />
        ))}
      </CommonMobileCardGrid>
    </div>
  )
}

export function TicketsSkeleton({
  className,
  showHeader = true,
}: TicketsSkeletonProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)} aria-label="Loading tickets" role="status">
      {showHeader ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="space-y-2">
            <Skeleton className={cn('h-8 w-36 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-56 rounded', uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-11 w-32 rounded-xl', uiSkeletonBlock)} />
        </div>
      ) : null}

      <HelpSupportSectionSkeleton />

      <Skeleton className={cn('h-4 w-24 rounded', uiSkeletonBlock)} />

      <TicketsContentSkeleton />
    </div>
  )
}
