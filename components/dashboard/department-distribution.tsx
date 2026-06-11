'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonEmptyState } from '@/components/common'
import { Users } from 'lucide-react'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { DashboardDepartmentItem } from '@/types/dashboard'

const CHART_COLORS = ['#7c3aed', '#a855f7', '#14b8a6', '#a3e635', '#f59e0b', '#64748b']

interface DepartmentDistributionProps {
  items: DashboardDepartmentItem[]
  isLoading?: boolean
}

export function DepartmentDistribution({ items, isLoading = false }: DepartmentDistributionProps) {
  const chartData = items.map((item, index) => ({
    name: item.name,
    value: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
    percentage: item.percentage,
  }))

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <Skeleton className={cn('h-48 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <h3 className="text-lg font-semibold text-cloud mb-1">Department Distribution</h3>
        <CommonEmptyState icon={Users} title="No department data" description="Department breakdown is not available." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <h3 className="text-lg font-semibold text-cloud mb-1">Department Distribution</h3>
      <p className="text-sm text-muted-foreground mb-6">Employee count by department</p>

      <div className="flex items-center gap-6">
        <div className="w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as (typeof chartData)[0]
                    return (
                      <div className="bg-carbon border border-border rounded-[16px] [corner-shape:squircle] px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium text-cloud">{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.value} employees ({data.percentage.toFixed(1)}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {chartData.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: dept.color }} />
                <span className="text-sm text-slate-300">{dept.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-cloud">{dept.value}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {total > 0 ? dept.percentage.toFixed(1) : '0.0'}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
