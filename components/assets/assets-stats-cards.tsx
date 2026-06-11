// components/assets/assets-stats-cards.tsx
'use client'

import { Package, CheckCircle2, TrendingUp, Banknote } from 'lucide-react'
import { CommonStatCardDisplay, type StatDisplayItem } from '@/components/common'

interface AssetsStatsCardsProps {
  totalCount: number
  inServiceCount: number
  utilizationRate: number
  totalValue: string
  isPageScoped?: boolean
  isLoading?: boolean
}

export function AssetsStatsCards({
  totalCount,
  inServiceCount,
  utilizationRate,
  totalValue,
  isPageScoped = false,
  isLoading = false,
}: AssetsStatsCardsProps) {
  const items: StatDisplayItem[] = [
    {
      key: 'total',
      label: 'Total Assets',
      icon: Package,
      iconClass: 'bg-violet-core/20 text-violet-glow',
      displayValue: totalCount,
    },
    {
      key: 'in_service',
      label: 'In Service',
      icon: CheckCircle2,
      iconClass: 'bg-lime-400/20 text-lime-400',
      displayValue: inServiceCount,
    },
    {
      key: 'utilization',
      label: 'Utilization Rate',
      icon: TrendingUp,
      iconClass: 'bg-teal-400/20 text-teal-400',
      displayValue: `${utilizationRate}%`,
    },
    {
      key: 'value',
      label: 'Total Value',
      icon: Banknote,
      iconClass: 'bg-amber-400/20 text-amber-400',
      displayValue: totalValue,
    },
  ]

  return (
    <div className="space-y-2">
      <CommonStatCardDisplay items={items} isLoading={isLoading} columns="4" />
      {isPageScoped && !isLoading && (
        <p className="text-xs text-muted-foreground">
          In-service, utilization, and value reflect the current page or active filters. Total count is from the server.
        </p>
      )}
    </div>
  )
}
