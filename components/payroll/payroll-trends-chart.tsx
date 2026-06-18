// components/payroll/payroll-trends-chart.tsx
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import type { PayrollTrendPoint } from '@/types/payroll'

interface PayrollTrendsChartProps {
  data: PayrollTrendPoint[]
  isLoading?: boolean
}

function PayrollTrendsTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const total = payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
  if (total === 0) return null

  return (
    <div className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium text-slate-100">{label}</p>
      <div className="space-y-0.5">
        {payload.map((entry) => (
          <p key={String(entry.dataKey)} className="text-slate-400">
            <span className="capitalize">{String(entry.dataKey)}:</span>{' '}
            {Number(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    </div>
  )
}

export function PayrollTrendsChart({ data, isLoading = false }: PayrollTrendsChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <Skeleton className={cn('h-64 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-cloud mb-1">Payroll Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly breakdown by category</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-violet-core" />
            <span className="text-xs text-slate-400">Base</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-violet-glow" />
            <span className="text-xs text-slate-400">Allowances</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-lime-400" />
            <span className="text-xs text-slate-400">Overtime</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              content={<PayrollTrendsTooltip />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.06)' }}
            />
            <Bar dataKey="base" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} activeBar={{ fill: '#7c3aed' }} />
            <Bar dataKey="allowances" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} activeBar={{ fill: '#a855f7' }} />
            <Bar dataKey="overtime" stackId="a" fill="#a3e635" radius={[4, 4, 0, 0]} activeBar={{ fill: '#a3e635' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
