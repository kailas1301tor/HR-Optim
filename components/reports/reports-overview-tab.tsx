// components/reports/reports-overview-tab.tsx
'use client'

import { Users, Clock, DollarSign, Package, ClipboardList } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '@/lib/utils'
import { reportsChartTooltipStyle, uiCard } from '@/lib/ui/design-system'
import type { ReportsData } from '@/types/reports'
import { ReportsGrowthBadge } from './reports-growth-badge'
import { ReportsChartCard } from './reports-chart-card'
import { ReportsPieChart } from './reports-pie-chart'

interface ReportsOverviewTabProps {
  data: ReportsData
  isLoading?: boolean
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`
  return `₹${value.toLocaleString()}`
}

export function ReportsOverviewTab({ data, isLoading = false }: ReportsOverviewTabProps) {
  const { employees, payroll, attendance, assets, requests } = data

  const kpiCards = [
    {
      key: 'employees',
      label: 'Total Employees',
      value: employees.summary.total.toLocaleString(),
      icon: Users,
      iconClass: 'bg-violet-core/20 text-violet-glow',
      growth: employees.summary.growthPercentage,
    },
    {
      key: 'attendance',
      label: 'Attendance Rate',
      value: `${attendance.summary.currentRate.toFixed(1)}%`,
      icon: Clock,
      iconClass: 'bg-lime-400/20 text-lime-400',
      growth: attendance.summary.growthPercentage,
    },
    {
      key: 'payroll',
      label: 'Current Net Payroll',
      value: formatCurrency(payroll.summary.currentNet),
      icon: DollarSign,
      iconClass: 'bg-teal-400/20 text-teal-400',
      growth: payroll.summary.growthPercentage,
    },
    {
      key: 'assets',
      label: 'Total Assets',
      value: assets.summary.total.toLocaleString(),
      icon: Package,
      iconClass: 'bg-amber-400/20 text-amber-400',
      growth: null,
    },
    {
      key: 'requests',
      label: 'Requests This Month',
      value: requests.summary.currentMonthTotal.toLocaleString(),
      icon: ClipboardList,
      iconClass: 'bg-violet-core/20 text-violet-glow',
      growth: requests.summary.growthPercentage,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.key} className={cn(uiCard, 'p-4')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-cloud font-mono tabular-nums mt-1">
                    {isLoading ? '—' : card.value}
                  </p>
                  {card.growth !== null && !isLoading ? (
                    <div className="mt-2">
                      <ReportsGrowthBadge percentage={card.growth} />
                    </div>
                  ) : null}
                </div>
                <div className={cn('p-2.5 rounded-xl shrink-0', card.iconClass)}>
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChartCard
          title="New Hires Trend"
          subtitle="Monthly hiring activity"
          isLoading={isLoading}
          isEmpty={!isLoading && employees.hireTrend.length === 0}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={employees.hireTrend}>
                <defs>
                  <linearGradient id="hireGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--violet-core)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--violet-core)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Tooltip contentStyle={reportsChartTooltipStyle} cursor={false} />
                <Area type="monotone" dataKey="value" stroke="var(--violet-core)" fill="url(#hireGradient)" name="New Hires" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ReportsChartCard>

        <ReportsChartCard
          title="Department Distribution"
          subtitle="Employees by department"
          isLoading={isLoading}
          isEmpty={!isLoading && employees.departmentDistribution.length === 0}
        >
          <ReportsPieChart data={employees.departmentDistribution} />
        </ReportsChartCard>
      </div>
    </div>
  )
}
