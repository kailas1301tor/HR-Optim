'use client'

import { motion } from 'framer-motion'
import {
  Users,
  Clock,
  FileWarning,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiCardInteractive } from '@/lib/ui/design-system'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  color: 'violet' | 'lime' | 'teal' | 'amber'
  sparkline?: number[]
}

const colorStyles = {
  violet: {
    bg: 'bg-violet-core/10 dark:bg-[#1a0a3c]',
    iconBg: 'bg-violet-core/20',
    iconColor: 'text-violet-glow',
    accent: 'text-violet-glow',
  },
  lime: {
    bg: 'bg-lime-400/10 dark:bg-[#0f2a1a]',
    iconBg: 'bg-lime-400/20',
    iconColor: 'text-lime-400',
    accent: 'text-lime-400',
  },
  teal: {
    bg: 'bg-teal-400/10 dark:bg-[#0a2a2a]',
    iconBg: 'bg-teal-400/20',
    iconColor: 'text-teal-400',
    accent: 'text-teal-400',
  },
  amber: {
    bg: 'bg-amber-400/10 dark:bg-[#2a1a0a]',
    iconBg: 'bg-amber-400/20',
    iconColor: 'text-amber-400',
    accent: 'text-amber-400',
  },
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 24
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  sparkline,
}: KPICardProps) {
  const styles = colorStyles[color]
  const isPositive = change && change > 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        uiCardInteractive,
        'relative p-5',
        styles.bg,
        'hover:ring-1 hover:ring-violet-core/40'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} />
        </div>
        {sparkline && (
          <Sparkline
            data={sparkline}
            color={color === 'violet' ? '#a855f7' : color === 'lime' ? '#a3e635' : color === 'teal' ? '#2dd4bf' : '#fbbf24'}
          />
        )}
      </div>

      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mb-1">
        {title}
      </p>
      <p className="text-3xl font-semibold text-cloud font-mono tracking-tight">
        {value}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          <div
            className={cn(
              'flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium',
              isPositive ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </div>
          {changeLabel && (
            <span className="text-xs text-slate-500">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export function KPIGrid() {
  const kpis = [
    {
      title: 'Total Employees',
      value: '2,847',
      change: 12,
      changeLabel: 'vs last month',
      icon: Users,
      color: 'violet' as const,
      sparkline: [45, 52, 49, 60, 55, 68, 72],
    },
    {
      title: 'Present Today',
      value: '2,651',
      change: 4.2,
      changeLabel: 'attendance rate',
      icon: Clock,
      color: 'lime' as const,
      sparkline: [88, 91, 89, 93, 90, 94, 93],
    },
    {
      title: 'Documents Expiring',
      value: '23',
      change: -8,
      changeLabel: 'vs last week',
      icon: FileWarning,
      color: 'amber' as const,
      sparkline: [32, 28, 31, 25, 27, 24, 23],
    },
    {
      title: 'Assets Tracked',
      value: '1,284',
      change: 5.3,
      changeLabel: 'utilization',
      icon: Package,
      color: 'teal' as const,
      sparkline: [1100, 1150, 1180, 1210, 1245, 1260, 1284],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <KPICard {...kpi} />
        </motion.div>
      ))}
    </div>
  )
}
