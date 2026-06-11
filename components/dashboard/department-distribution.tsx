'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const departmentData = [
  { name: 'Engineering', value: 847, color: '#7c3aed' },
  { name: 'Operations', value: 623, color: '#a855f7' },
  { name: 'Finance', value: 412, color: '#14b8a6' },
  { name: 'HR', value: 298, color: '#a3e635' },
  { name: 'Marketing', value: 234, color: '#f59e0b' },
  { name: 'Others', value: 433, color: '#64748b' },
]

const total = departmentData.reduce((sum, d) => sum + d.value, 0)

export function DepartmentDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <h3 className="text-lg font-semibold text-cloud mb-1">Department Distribution</h3>
      <p className="text-sm text-muted-foreground mb-6">Employee count by department</p>

      <div className="flex items-center gap-6">
        {/* Chart */}
        <div className="w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-carbon border border-border rounded-[16px] [corner-shape:squircle] px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium text-cloud">{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.value} employees ({((data.value / total) * 100).toFixed(1)}%)
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

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {departmentData.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: dept.color }}
                />
                <span className="text-sm text-slate-300">{dept.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-cloud">{dept.value}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {((dept.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
