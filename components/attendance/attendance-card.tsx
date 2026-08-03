// components/attendance/attendance-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { uiCard } from '@/lib/ui/design-system'
import { getShiftBadgeClassName } from './attendance-constants'
import { AttendanceDayRows } from './attendance-day-rows'
import { buildAttendanceSummaryLabel } from './attendance-day-summary'
import { AttendanceSummary } from './attendance-summary'
import { AttendanceDayTimeGrid } from './attendance-time-display'
import type { TeamAttendanceDay, TeamAttendanceEmployee } from '@/types/attendance'

interface AttendanceCardProps {
  employee: TeamAttendanceEmployee
  index: number
  isRangeMode: boolean
  onDayClick?: (employee: TeamAttendanceEmployee, day: TeamAttendanceDay) => void
}

function EmployeeHeader({
  employee,
  days,
  canExpand,
  isOpen,
}: {
  employee: TeamAttendanceEmployee
  days: TeamAttendanceDay[]
  canExpand: boolean
  isOpen: boolean
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Avatar className="w-10 h-10 shrink-0 mt-0.5">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {employee.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-cloud truncate max-w-[130px]">
                {employee.employeeName}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-violet-core/10 border border-violet-core/20 font-mono text-[9px] text-violet-glow font-semibold shrink-0">
                {employee.employeeId}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {employee.department} {employee.role ? `• ${employee.role}` : ''}
            </p>
            {(employee.email || employee.phoneNumber) && (
              <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">
                {employee.email} {employee.email && employee.phoneNumber ? '•' : ''}{' '}
                {employee.phoneNumber}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-[11px] font-medium',
              getShiftBadgeClassName(employee.shiftName),
            )}
          >
            {employee.shiftName}
          </span>
          {canExpand ? (
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
              aria-hidden
            />
          ) : null}
        </div>
      </div>
      <div className="pt-3 border-t border-border/40">
        <AttendanceSummary days={days} />
        {canExpand ? (
          <p className="text-[10px] text-muted-foreground mt-1">
            {isOpen ? 'Tap a day for details' : 'Tap to view daily breakdown'}
          </p>
        ) : null}
      </div>
    </>
  )
}

export function AttendanceCard({
  employee,
  index,
  isRangeMode,
  onDayClick,
}: AttendanceCardProps) {
  const canExpand = isRangeMode || employee.attendanceData.length > 1
  const [isOpen, setIsOpen] = useState(false)
  const summaryLabel = buildAttendanceSummaryLabel(employee.attendanceData)
  const singleDay = employee.attendanceData.length === 1 ? employee.attendanceData[0] : null

  const handleDayClick = (day: TeamAttendanceDay): void => {
    onDayClick?.(employee, day)
  }

  if (!canExpand && singleDay) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.25 }}
        onClick={() => onDayClick?.(employee, singleDay)}
        className={cn(
          uiCard,
          'p-5 min-w-0 overflow-hidden cursor-pointer hover:bg-violet-core/5 transition-colors',
        )}
        aria-label={`${employee.employeeName} attendance — ${summaryLabel}`}
      >
        <EmployeeHeader
          employee={employee}
          days={employee.attendanceData}
          canExpand={false}
          isOpen={false}
        />
        {!isRangeMode ? (
          <div className="mt-3 pt-3 border-t border-border/40">
            <AttendanceDayTimeGrid day={singleDay} />
          </div>
        ) : null}
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className={cn(uiCard, 'p-5 min-w-0 overflow-hidden')}
      aria-label={`${employee.employeeName} attendance — ${summaryLabel}`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full text-left cursor-pointer rounded-xl hover:bg-violet-core/5 transition-colors -m-1 p-1"
            aria-expanded={isOpen}
            aria-label={`${employee.employeeName} attendance — ${isOpen ? 'collapse' : 'expand'} daily breakdown`}
          >
            <EmployeeHeader
              employee={employee}
              days={employee.attendanceData}
              canExpand={canExpand}
              isOpen={isOpen}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="pt-3 mt-1 border-t border-border/40">
            <AttendanceDayRows days={employee.attendanceData} onDayClick={handleDayClick} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.article>
  )
}
