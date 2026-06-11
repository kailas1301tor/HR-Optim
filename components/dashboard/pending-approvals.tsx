// components/dashboard/pending-approvals.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonEmptyState, CommonErrorBanner } from '@/components/common'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { typeConfig } from '@/components/requests/requests-constants'
import { usePendingApprovals } from './usePendingApprovals'

export function PendingApprovals() {
  const { items, pendingCount, isLoading, hasError, reload } = usePendingApprovals()

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <Skeleton className={cn('h-64 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-cloud">Pending Approvals</h3>
        <span className="px-2 py-1 rounded-full bg-violet-core/20 text-violet-glow text-xs font-medium">
          {pendingCount} pending
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Review and approve employee requests
      </p>

      {hasError ? (
        <CommonErrorBanner message="Failed to load pending requests" onRetry={reload} />
      ) : null}

      {!hasError && pendingCount === 0 ? (
        <CommonEmptyState
          icon={Clock}
          title="No pending approvals"
          description="All employee requests have been reviewed."
          actions={
            <Button variant="outline" asChild>
              <Link href="/requests">View Requests</Link>
            </Button>
          }
        />
      ) : null}

      {!hasError && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((request) => {
            const type = typeConfig[request.type]
            const TypeIcon = type.icon

            return (
              <Link
                key={request.id}
                href="/requests?status=pending"
                className={cn(
                  'flex items-center gap-3 rounded-[20px] [corner-shape:squircle] border border-border/50',
                  'bg-midnight/20 p-3 transition-colors hover:border-violet-core/40 hover:bg-midnight/35',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] [corner-shape:squircle] ring-1 ring-inset',
                    type.iconSurface,
                  )}
                >
                  <TypeIcon className="h-4 w-4" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-cloud">{request.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[8px]">{request.requester.initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{request.requester.name}</span>
                    <span aria-hidden>·</span>
                    <span className="shrink-0">{request.submittedAt}</span>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            )
          })}

          <Button variant="outline" className="w-full" asChild>
            <Link href="/requests?status=pending">
              {pendingCount > items.length
                ? `View all ${pendingCount} pending`
                : 'View Requests'}
            </Link>
          </Button>
        </div>
      ) : null}
    </motion.div>
  )
}
