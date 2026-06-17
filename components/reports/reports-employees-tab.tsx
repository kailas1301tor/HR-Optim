// components/reports/reports-employees-tab.tsx
'use client'

import { Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CommonStatCardDisplay } from '@/components/common'
import type { EmployeesReportData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'
import { ReportsPieChart } from './reports-pie-chart'

interface ReportsEmployeesTabProps {
  data: EmployeesReportData
  isLoading?: boolean
}

export function ReportsEmployeesTab({ data, isLoading = false }: ReportsEmployeesTabProps) {
  const { summary, hireTrend, departmentDistribution } = data

  return (
    <div className="space-y-6">
      <CommonStatCardDisplay
        isLoading={isLoading}
        columns="3"
        items={[
          {
            key: 'total',
            label: 'Total Employees',
            icon: Users,
            iconClass: 'bg-violet-core/20 text-violet-glow',
            displayValue: summary.total.toLocaleString(),
          },
          {
            key: 'last-month',
            label: 'Last Month Total',
            icon: Users,
            iconClass: 'bg-slate-500/20 text-slate-400',
            displayValue: summary.lastMonthTotal.toLocaleString(),
          },
          {
            key: 'growth',
            label: 'Growth',
            icon: Users,
            iconClass: summary.growthPercentage >= 0 ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-400',
            displayValue: isLoading ? '—' : <ReportsGrowthBadge percentage={summary.growthPercentage} className="text-sm" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChartCard
          title="New Hires by Month"
          subtitle="Hiring trend over the last 6 months"
          isLoading={isLoading}
          isEmpty={!isLoading && hireTrend.length === 0}
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hireTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} name="New Hires" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ReportsChartCard>

        <ReportsChartCard
          title="Department Breakdown"
          subtitle="Headcount by department"
          isLoading={isLoading}
          isEmpty={!isLoading && departmentDistribution.length === 0}
        >
          <ReportsPieChart data={departmentDistribution} height={320} />
        </ReportsChartCard>
      </div>
    </div>
  )
}
