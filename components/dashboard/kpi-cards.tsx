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
import { Skeleton } from '@/components/ui/skeleton'
import { uiCardInteractive, uiSkeletonBlock } from '@/lib/ui/design-system'
import type { DashboardKpiItem } from '@/types/dashboard'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  color: 'violet' | 'lime' | 'teal' | 'amber'
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

const KPI_ICONS: Record<string, React.ElementType> = {
  'Total Employees': Users,
  'Present Today': Clock,
  'Documents Expiring': FileWarning,
  'Assets Tracked': Package,
}

function KPICard({ title, value, change, changeLabel, icon: Icon, color }: KPICardProps) {
  const styles = colorStyles[color]
  const isPositive = change !== undefined && change >= 0

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        uiCardInteractive,
        'p-6 relative overflow-hidden',
        styles.bg,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-[20px] [corner-shape:squircle]', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} />
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-cloud font-mono tracking-tight">{value}</p>

      {change !== undefined && (
        <div className="flex items-center gap-2 mt-3">
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isPositive ? 'text-lime-400' : 'text-red-400',
            )}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
          {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}

interface KPIGridProps {
  kpis: DashboardKpiItem[]
  isLoading?: boolean
}

export function KPIGrid({ kpis, isLoading = false }: KPIGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn('h-36 rounded-[32px] [corner-shape:squircle]', uiSkeletonBlock)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <KPICard {...kpi} icon={KPI_ICONS[kpi.title] ?? Users} />
        </motion.div>
      ))}
    </div>
  )
}
