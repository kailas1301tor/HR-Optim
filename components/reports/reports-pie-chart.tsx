// components/reports/reports-pie-chart.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { reportsChartTooltipStyle } from '@/lib/ui/design-system'
import type { ReportChartItem } from '@/types/reports'

interface ReportsPieChartProps {
  data: ReportChartItem[]
  height?: number
}

export function ReportsPieChart({ data, height = 280 }: ReportsPieChartProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="w-full lg:w-48 shrink-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={reportsChartTooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 min-w-0">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-semibold text-foreground ml-auto tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
