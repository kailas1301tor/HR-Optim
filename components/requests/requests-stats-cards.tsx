// components/requests/requests-stats-cards.tsx
'use client'

import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import { CommonErrorBanner, CommonStatCards, type StatCardItem } from '@/components/common'
import type { RequestStatusFilter, StatusCounts } from '@/types/request'

interface RequestsStatsCardsProps {
  statusCounts: StatusCounts
  statusFilter: RequestStatusFilter
  isCountsLoading: boolean
  countsHasError?: boolean
  onRetryCounts?: () => void
  onStatusChange: (status: RequestStatusFilter) => void
}

const STAT_CARDS: StatCardItem[] = [
  {
    key: 'pending',
    label: 'Pending',
    count: 0,
    icon: Clock,
    iconClass: 'bg-violet-core/20 text-violet-glow',
    activeRing: 'ring-2 ring-violet-core/50 border-violet-core/40',
  },
  {
    key: 'approved',
    label: 'Approved',
    count: 0,
    icon: CheckCircle2,
    iconClass: 'bg-lime-400/20 text-lime-400',
    activeRing: 'ring-2 ring-lime-400/40 border-lime-400/30',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    count: 0,
    icon: XCircle,
    iconClass: 'bg-red-500/20 text-red-400',
    activeRing: 'ring-2 ring-red-500/40 border-red-500/30',
  },
]

export function RequestsStatsCards({
  statusCounts,
  statusFilter,
  isCountsLoading,
  countsHasError = false,
  onRetryCounts,
  onStatusChange,
}: RequestsStatsCardsProps) {
  const items = STAT_CARDS.map((card) => ({
    ...card,
    count: statusCounts[card.key as keyof StatusCounts],
  }))

  return (
    <div className="space-y-2">
      {countsHasError && (
        <CommonErrorBanner
          message="Request status counts could not be loaded."
          onRetry={onRetryCounts}
        />
      )}
      <CommonStatCards
        items={items}
        activeKey={statusFilter === 'all' ? '' : statusFilter}
        isLoading={isCountsLoading}
        allowDeselect
        onSelect={(key) => onStatusChange(key === 'all' ? 'all' : (key as RequestStatusFilter))}
      />
    </div>
  )
}
