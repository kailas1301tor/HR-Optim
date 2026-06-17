// components/reports/reports-requests-chart.tsx
'use client'

import { useState } from 'react'
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
import type { TooltipProps } from 'recharts'
import { cn } from '@/lib/utils'
import { uiSquircleSm } from '@/lib/ui/design-system'
import type { ReportRequestDistributionItem } from '@/types/reports'

const REQUEST_CHART_COLORS = {
  pending: {
    fill: 'rgba(245, 158, 11, 0.82)',
    dimmed: 'rgba(245, 158, 11, 0.32)',
    hover: 'rgba(251, 191, 36, 1)',
    dot: '#f59e0b',
    label: 'Pending',
  },
  approved: {
    fill: 'rgba(132, 204, 22, 0.82)',
    dimmed: 'rgba(132, 204, 22, 0.32)',
    hover: 'rgba(163, 230, 53, 1)',
    dot: '#84cc16',
    label: 'Approved',
  },
  rejected: {
    fill: 'rgba(248, 113, 113, 0.82)',
    dimmed: 'rgba(248, 113, 113, 0.32)',
    hover: 'rgba(252, 165, 165, 1)',
    dot: '#f87171',
    label: 'Rejected',
  },
} as const

type StatusKey = keyof typeof REQUEST_CHART_COLORS

interface RequestsChartTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>
  label?: string
}

function RequestsChartTooltip({ active, payload, label }: RequestsChartTooltipProps) {
  if (!active || !payload?.length) return null

  const rows = payload.filter((item) => item.value !== undefined && Number(item.value) > 0)
  if (rows.length === 0) return null

  const total = rows.reduce((sum, item) => sum + (Number(item.value) || 0), 0)

  return (
    <div
      className={cn(
        'min-w-[168px] border border-border/80 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md',
        uiSquircleSm,
      )}
    >
      <p className="text-xs font-semibold text-foreground mb-2.5">{label}</p>
      <div className="space-y-2">
        {rows.map((item) => {
          const key = String(item.dataKey) as StatusKey
          const dotColor = REQUEST_CHART_COLORS[key]?.dot ?? item.color
          return (
            <div key={item.dataKey} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="h-2 w-2 shrink-0 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: dotColor }}
                />
                {item.name}
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {Number(item.value).toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold text-foreground tabular-nums">{total.toLocaleString()}</span>
      </div>
    </div>
  )
}

function RequestsChartLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-5">
      {(Object.keys(REQUEST_CHART_COLORS) as StatusKey[]).map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full ring-2 ring-background/80"
            style={{ backgroundColor: REQUEST_CHART_COLORS[key].dot }}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {REQUEST_CHART_COLORS[key].label}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ReportsRequestsChartProps {
  data: ReportRequestDistributionItem[]
}

export function ReportsRequestsChart({ data }: ReportsRequestsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getCellFill = (status: StatusKey, index: number) => {
    const colors = REQUEST_CHART_COLORS[status]
    const isHovered = hoveredIndex === index
    const isDimmed = hoveredIndex !== null && hoveredIndex !== index
    if (isHovered) return colors.hover
    if (isDimmed) return colors.dimmed
    return colors.fill
  }

  return (
    <div>
      <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="28%"
          onMouseMove={(state) => {
            const index = state?.activeTooltipIndex
            setHoveredIndex(typeof index === 'number' ? index : null)
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            content={<RequestsChartTooltip />}
            cursor={false}
            animationDuration={180}
          />
          <Bar
            dataKey="pending"
            name="Pending"
            stackId="requests"
            radius={[0, 0, 6, 6]}
            maxBarSize={56}
            isAnimationActive
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`pending-${entry.type}`}
                fill={getCellFill('pending', index)}
                className="transition-[fill] duration-200 ease-out"
              />
            ))}
          </Bar>
          <Bar
            dataKey="approved"
            name="Approved"
            stackId="requests"
            maxBarSize={56}
            isAnimationActive
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`approved-${entry.type}`}
                fill={getCellFill('approved', index)}
                className="transition-[fill] duration-200 ease-out"
              />
            ))}
          </Bar>
          <Bar
            dataKey="rejected"
            name="Rejected"
            stackId="requests"
            radius={[6, 6, 0, 0]}
            maxBarSize={56}
            isAnimationActive
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell
                key={`rejected-${entry.type}`}
                fill={getCellFill('rejected', index)}
                className="transition-[fill] duration-200 ease-out"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      <RequestsChartLegend />
    </div>
  )
}
