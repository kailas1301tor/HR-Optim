// components/attendance/attendance-status-pill.tsx
'use client'

import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types/attendance'
import { STATUS_CONFIG } from './attendance-constants'

interface AttendanceStatusPillProps {
  status: AttendanceStatus
  className?: string
}

export function AttendanceStatusPill({ status, className }: AttendanceStatusPillProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold',
        config.pillClassName,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
