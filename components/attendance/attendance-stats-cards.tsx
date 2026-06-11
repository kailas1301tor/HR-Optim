// components/attendance/attendance-stats-cards.tsx
'use client'

import { Clock, UserCheck, UserX, CalendarOff, Users } from 'lucide-react'
import { CommonStatCardDisplay, type StatDisplayItem } from '@/components/common'
import type { AttendanceStatusCounts } from '@/types/attendance'

const ATTENDANCE_STAT_KEYS = ['present', 'late', 'absent', 'leave', 'weekend'] as const

const ATTENDANCE_STAT_META: Record<
  (typeof ATTENDANCE_STAT_KEYS)[number],
  { label: string; icon: typeof UserCheck; iconClass: string }
> = {
  present: { label: 'Present', icon: UserCheck, iconClass: 'bg-lime-400/20 text-lime-400' },
  late: { label: 'Late', icon: Clock, iconClass: 'bg-amber-400/20 text-amber-400' },
  absent: { label: 'Absent', icon: UserX, iconClass: 'bg-red-500/20 text-red-400' },
  leave: { label: 'On Leave', icon: CalendarOff, iconClass: 'bg-slate-500/20 text-slate-400' },
  weekend: { label: 'Weekend', icon: Users, iconClass: 'bg-slate-600/20 text-slate-500' },
}

interface AttendanceStatsCardsProps {
  statusCounts: AttendanceStatusCounts
  isLoading?: boolean
}

export function AttendanceStatsCards({ statusCounts, isLoading = false }: AttendanceStatsCardsProps) {
  const items: StatDisplayItem[] = ATTENDANCE_STAT_KEYS.map((key) => {
    const meta = ATTENDANCE_STAT_META[key]
    return {
      key,
      label: meta.label,
      icon: meta.icon,
      iconClass: meta.iconClass,
      displayValue: statusCounts[key],
    }
  })

  return (
    <CommonStatCardDisplay
      items={items}
      isLoading={isLoading}
      columns="4"
      className="sm:grid-cols-2 lg:grid-cols-5"
    />
  )
}
