// components/reports/reports-attendance-tab.tsx
'use client'

import { Clock } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CommonStatCardDisplay } from '@/components/common'
import { reportsChartTooltipStyle } from '@/lib/ui/design-system'
import type { AttendanceReportData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'

interface ReportsAttendanceTabProps {
  data: AttendanceReportData
  isLoading?: boolean
}

export function ReportsAttendanceTab({ data, isLoading = false }: ReportsAttendanceTabProps) {
  const { summary, trend } = data

  return (
    <div className="space-y-6">
      <CommonStatCardDisplay
        isLoading={isLoading}
        columns="3"
        items={[
          {
            key: 'current',
            label: 'Current Rate',
            icon: Clock,
            iconClass: 'bg-lime-400/20 text-lime-400',
            displayValue: `${summary.currentRate.toFixed(1)}%`,
          },
          {
            key: 'last-month',
            label: 'Last Month Rate',
            icon: Clock,
            iconClass: 'bg-slate-500/20 text-slate-400',
            displayValue: `${summary.lastMonthRate.toFixed(1)}%`,
          },
          {
            key: 'growth',
            label: 'Growth',
            icon: Clock,
            iconClass: summary.growthPercentage >= 0 ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-400',
            displayValue: isLoading ? '—' : <ReportsGrowthBadge percentage={summary.growthPercentage} className="text-sm" />,
          },
        ]}
      />

      <ReportsChartCard
        title="Daily Present Count"
        subtitle="Employees present per day"
        isLoading={isLoading}
        isEmpty={!isLoading && trend.length === 0}
      >
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={reportsChartTooltipStyle} cursor={false} />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#a3e635"
                strokeWidth={2}
                dot={{ fill: '#a3e635', r: 3 }}
                name="Present"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ReportsChartCard>
    </div>
  )
}
