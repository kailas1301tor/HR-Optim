// components/employees/employees-stats-cards.tsx
'use client'

import { Users, UserCheck, CalendarOff, UserPlus } from 'lucide-react'
import { CommonStatCardDisplay, type StatDisplayItem } from '@/components/common'

interface EmployeesStatsCardsProps {
  totalCount: number
  activeCount: number
  onLeaveCount: number
  onboardingCount: number
  isLoading?: boolean
}

export function EmployeesStatsCards({
  totalCount,
  activeCount,
  onLeaveCount,
  onboardingCount,
  isLoading = false,
}: EmployeesStatsCardsProps) {
  const items: StatDisplayItem[] = [
    {
      key: 'total',
      label: 'Total Employees',
      icon: Users,
      iconClass: 'bg-violet-core/20 text-violet-glow',
      displayValue: totalCount,
    },
    {
      key: 'active',
      label: 'Active',
      icon: UserCheck,
      iconClass: 'bg-lime-400/20 text-lime-400',
      displayValue: activeCount,
    },
    {
      key: 'on_leave',
      label: 'On Leave',
      icon: CalendarOff,
      iconClass: 'bg-slate-500/20 text-slate-400',
      displayValue: onLeaveCount,
    },
    {
      key: 'onboarding',
      label: 'Onboarding',
      icon: UserPlus,
      iconClass: 'bg-amber-400/20 text-amber-400',
      displayValue: onboardingCount,
    },
  ]

  return <CommonStatCardDisplay items={items} isLoading={isLoading} columns="4" />
}
