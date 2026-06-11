// components/documents/documents-stats-cards.tsx
'use client'

import { CommonStatCards, type StatCardItem } from '@/components/common'
import { statusConfig } from './documents-constants'
import type { DocumentStatusCounts } from '@/types/document'

const DOC_STAT_CARDS: StatCardItem[] = [
  {
    key: 'valid',
    label: 'Valid',
    count: 0,
    icon: statusConfig.valid.icon,
    iconClass: 'bg-lime-400/20 text-lime-400',
    activeRing: 'ring-2 ring-lime-400/40 border-lime-400/30',
  },
  {
    key: 'expiring',
    label: 'Expiring Soon',
    count: 0,
    icon: statusConfig.expiring.icon,
    iconClass: 'bg-amber-400/20 text-amber-400',
    activeRing: 'ring-2 ring-amber-400/40 border-amber-400/30',
  },
  {
    key: 'expired',
    label: 'Expired',
    count: 0,
    icon: statusConfig.expired.icon,
    iconClass: 'bg-red-500/20 text-red-400',
    activeRing: 'ring-2 ring-red-500/40 border-red-500/30',
  },
]

interface DocumentsStatsCardsProps {
  counts: DocumentStatusCounts
  statusFilter: string
  isLoading?: boolean
  onSelect: (key: string) => void
}

export function DocumentsStatsCards({
  counts,
  statusFilter,
  isLoading = false,
  onSelect,
}: DocumentsStatsCardsProps) {
  const statItems = DOC_STAT_CARDS.map((card) => ({
    ...card,
    count:
      card.key === 'valid'
        ? counts.valid
        : card.key === 'expiring'
          ? counts.expiring_soon
          : counts.expired,
  }))

  return (
    <CommonStatCards
      items={statItems}
      activeKey={statusFilter}
      isLoading={isLoading}
      onSelect={onSelect}
    />
  )
}
