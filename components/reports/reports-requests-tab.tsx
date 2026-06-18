// components/reports/reports-requests-tab.tsx
'use client'

import { ClipboardList } from 'lucide-react'
import { CommonStatCardDisplay } from '@/components/common'
import type { RequestsReportData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'
import { ReportsRequestsChart } from './reports-requests-chart'

interface ReportsRequestsTabProps {
  data: RequestsReportData
  isLoading?: boolean
}

export function ReportsRequestsTab({ data, isLoading = false }: ReportsRequestsTabProps) {
  const { summary, distribution } = data

  return (
    <div className="space-y-6">
      <CommonStatCardDisplay
        isLoading={isLoading}
        columns="3"
        items={[
          {
            key: 'current',
            label: 'This Month',
            icon: ClipboardList,
            iconClass: 'bg-violet-core/20 text-violet-glow',
            displayValue: summary.currentMonthTotal.toLocaleString(),
          },
          {
            key: 'last-month',
            label: 'Last Month',
            icon: ClipboardList,
            iconClass: 'bg-slate-500/20 text-slate-400',
            displayValue: summary.lastMonthTotal.toLocaleString(),
          },
          {
            key: 'growth',
            label: 'Growth',
            icon: ClipboardList,
            iconClass:
              summary.growthPercentage >= 0
                ? 'bg-lime-400/20 text-lime-400'
                : 'bg-red-500/20 text-red-400',
            displayValue: isLoading ? (
              '—'
            ) : (
              <ReportsGrowthBadge percentage={summary.growthPercentage} className="text-sm" />
            ),
          },
        ]}
      />

      <ReportsChartCard
        title="Requests by Type"
        subtitle="Pending, approved, and rejected counts"
        isLoading={isLoading}
        isEmpty={!isLoading && distribution.length === 0}
      >
        <ReportsRequestsChart data={distribution} />
      </ReportsChartCard>
    </div>
  )
}
