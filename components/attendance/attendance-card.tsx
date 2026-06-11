// components/attendance/attendance-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { uiCard } from '@/lib/ui/design-system'
import { STATUS_CONFIG, getShiftBadgeClassName } from './attendance-constants'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceCardProps {
  record: AttendanceRecord
  index: number
}

export function AttendanceCard({ record, index }: AttendanceCardProps) {
  const status = STATUS_CONFIG[record.status]

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className={cn(uiCard, 'p-5')}
      aria-label={`${record.employeeName} attendance — ${status.label}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {record.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cloud truncate">{record.employeeName}</p>
            <p className="text-xs text-muted-foreground truncate">{record.department}</p>
          </div>
        </div>
        <span
          className={cn(
            'px-2 py-1 rounded-full text-[11px] font-medium shrink-0',
            getShiftBadgeClassName(record.shiftName),
          )}
        >
          {record.shiftName}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className={cn('w-2 h-2 rounded-full', status.dotColor)} aria-hidden />
        <span className="text-sm text-slate-300">{status.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs">
        <div>
          <p className="text-muted-foreground mb-1">Time In</p>
          <div className="flex items-center gap-1.5 font-mono text-cloud">
            <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
            {record.timeIn || '--:--'}
          </div>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Time Out</p>
          <div className="flex items-center gap-1.5 font-mono text-cloud">
            <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
            {record.timeOut || '--:--'}
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-muted-foreground mb-1">Work Hours</p>
          <span className="font-mono text-sm text-cloud">{record.workHours || '--'}</span>
        </div>
      </div>
    </motion.article>
  )
}
