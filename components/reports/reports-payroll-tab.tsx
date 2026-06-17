// components/reports/reports-payroll-tab.tsx
'use client'

import { DollarSign } from 'lucide-react'
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
import type { PayrollReportData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'

interface ReportsPayrollTabProps {
  data: PayrollReportData
  isLoading?: boolean
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `AED ${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `AED ${(value / 1_000).toFixed(1)}K`
  return `AED ${value.toLocaleString()}`
}

export function ReportsPayrollTab({ data, isLoading = false }: ReportsPayrollTabProps) {
  const { summary, trend } = data

  return (
    <div className="space-y-6">
      <CommonStatCardDisplay
        isLoading={isLoading}
        columns="3"
        items={[
          {
            key: 'gross',
            label: 'Current Gross',
            icon: DollarSign,
            iconClass: 'bg-violet-core/20 text-violet-glow',
            displayValue: formatCurrency(summary.currentGross),
          },
          {
            key: 'net',
            label: 'Current Net',
            icon: DollarSign,
            iconClass: 'bg-teal-400/20 text-teal-400',
            displayValue: formatCurrency(summary.currentNet),
          },
          {
            key: 'growth',
            label: 'Growth',
            icon: DollarSign,
            iconClass: summary.growthPercentage >= 0 ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-400',
            displayValue: isLoading ? '—' : <ReportsGrowthBadge percentage={summary.growthPercentage} className="text-sm" />,
          },
        ]}
      />

      <ReportsChartCard
        title="Payroll Trend"
        subtitle="Gross vs net pay by month"
        isLoading={isLoading}
        isEmpty={!isLoading && trend.length === 0}
      >
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Bar dataKey="gross" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Gross" />
              <Bar dataKey="net" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Net" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ReportsChartCard>
    </div>
  )
}
