// components/reports/reports-requests-tab.tsx
'use client'

import { ClipboardList } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CommonStatCardDisplay } from '@/components/common'
import type { RequestsReportData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'

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
            iconClass: summary.growthPercentage >= 0 ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-400',
            displayValue: isLoading ? '—' : <ReportsGrowthBadge percentage={summary.growthPercentage} className="text-sm" />,
          },
        ]}
      />

      <ReportsChartCard
        title="Requests by Type"
        subtitle="Pending, approved, and rejected counts"
        isLoading={isLoading}
        isEmpty={!isLoading && distribution.length === 0}
      >
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" stackId="a" />
              <Bar dataKey="approved" fill="#a3e635" radius={[4, 4, 0, 0]} name="Approved" stackId="a" />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportsChartCard>
    </div>
  )
}
