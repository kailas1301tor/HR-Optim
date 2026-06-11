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
import { monthlyData } from './payroll-constants'

export function PayrollTrendsChart() {
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
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
              }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="base" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} />
            <Bar dataKey="allowances" stackId="a" fill="#a855f7" radius={[0, 0, 0, 0]} />
            <Bar dataKey="overtime" stackId="a" fill="#a3e635" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
