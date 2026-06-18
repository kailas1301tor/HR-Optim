// components/reports/reports-assets-tab.tsx
'use client'

import { Package } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CommonStatCardDisplay } from '@/components/common'
import { reportsChartTooltipStyle } from '@/lib/ui/design-system'
import type { AssetsReportData } from '@/types/reports'
import { ReportsChartCard } from './reports-chart-card'
import { ReportsPieChart } from './reports-pie-chart'

interface ReportsAssetsTabProps {
  data: AssetsReportData
  isLoading?: boolean
}

export function ReportsAssetsTab({ data, isLoading = false }: ReportsAssetsTabProps) {
  const { summary, statusDistribution, categoryDistribution } = data

  return (
    <div className="space-y-6">
      <CommonStatCardDisplay
        isLoading={isLoading}
        columns="3"
        items={[
          {
            key: 'total',
            label: 'Total Assets',
            icon: Package,
            iconClass: 'bg-violet-core/20 text-violet-glow',
            displayValue: summary.total.toLocaleString(),
          },
          {
            key: 'assigned',
            label: 'Assigned',
            icon: Package,
            iconClass: 'bg-lime-400/20 text-lime-400',
            displayValue: summary.assigned.toLocaleString(),
          },
          {
            key: 'available',
            label: 'Available',
            icon: Package,
            iconClass: 'bg-teal-400/20 text-teal-400',
            displayValue: summary.available.toLocaleString(),
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChartCard
          title="Status Distribution"
          subtitle="Assets by assignment status"
          isLoading={isLoading}
          isEmpty={!isLoading && statusDistribution.length === 0}
        >
          <ReportsPieChart data={statusDistribution} />
        </ReportsChartCard>

        <ReportsChartCard
          title="Category Breakdown"
          subtitle="Assets by category"
          isLoading={isLoading}
          isEmpty={!isLoading && categoryDistribution.length === 0}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={reportsChartTooltipStyle} cursor={false} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Count">
                  {categoryDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ReportsChartCard>
      </div>
    </div>
  )
}
