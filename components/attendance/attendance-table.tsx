// components/attendance/attendance-table.tsx
'use client'

import { Fragment, useState } from 'react'
import { ChevronDown, Clock } from 'lucide-react'
import { formatDisplayDate } from '@/lib/helpers/format-api-date'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { uiTableShell } from '@/lib/ui/design-system'
import { STATUS_CONFIG, getShiftBadgeClassName } from './attendance-constants'
import { AttendanceSummary } from './attendance-summary'
import type { TeamAttendanceDay, TeamAttendanceEmployee } from '@/types/attendance'

interface AttendanceTableProps {
  records: TeamAttendanceEmployee[]
  isRangeMode?: boolean
  onDayClick?: (employee: TeamAttendanceEmployee, day: TeamAttendanceDay) => void
}

const TABLE_COLUMNS = [
  { id: 'expand', label: '' },
  { id: 'employee', label: 'Employee' },
  { id: 'shift', label: 'Shift' },
  { id: 'summary', label: 'Summary' },
] as const

export function AttendanceTable({ records, isRangeMode = false, onDayClick }: AttendanceTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const handleToggleRow = (employeeId: string): void => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(employeeId)) {
        next.delete(employeeId)
      } else {
        next.add(employeeId)
      }
      return next
    })
  }

  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500',
                    col.id === 'expand' && 'w-10',
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((employee) => {
              const canExpand = isRangeMode
                ? employee.attendanceData.length > 0
                : employee.attendanceData.length > 1
              const isExpanded = expandedIds.has(employee.id)

              return (
                <Fragment key={employee.id}>
                  <tr
                    className={cn(
                      'border-b border-border/50 hover:bg-violet-core/5 transition-colors cursor-pointer',
                    )}
                    onClick={() => {
                      if (!canExpand && employee.attendanceData.length === 1 && onDayClick) {
                        onDayClick(employee, employee.attendanceData[0])
                        return
                      }
                      if (canExpand) {
                        handleToggleRow(employee.id)
                      }
                    }}
                    aria-expanded={canExpand ? isExpanded : undefined}
                  >
                    <td className="px-4 py-3">
                      {canExpand ? (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-muted-foreground transition-transform',
                            isExpanded && 'rotate-180',
                          )}
                          aria-hidden
                        />
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
                            {employee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-cloud">{employee.employeeName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-violet-core/10 border border-violet-core/20 font-mono text-[10px] text-violet-glow font-semibold shrink-0">
                              {employee.employeeId}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {employee.department} {employee.role ? `• ${employee.role}` : ''}
                          </p>
                          {(employee.email || employee.phoneNumber) && (
                            <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate max-w-[250px]">
                              {employee.email} {employee.email && employee.phoneNumber ? '•' : ''}{' '}
                              {employee.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-[11px] font-medium',
                          getShiftBadgeClassName(employee.shiftName),
                        )}
                      >
                        {employee.shiftName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceSummary days={employee.attendanceData} />
                    </td>
                  </tr>

                  {isExpanded && canExpand ? (
                    <tr className="border-b border-border/50 bg-midnight/30">
                      <td colSpan={TABLE_COLUMNS.length} className="px-4 py-3">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-muted-foreground border-b border-border/30">
                                <th className="pb-2 text-left font-semibold">Date</th>
                                <th className="pb-2 text-left font-semibold">Status</th>
                                <th className="pb-2 text-left font-semibold">Time In</th>
                                <th className="pb-2 text-left font-semibold">Time Out</th>
                                <th className="pb-2 text-left font-semibold">Work Hours</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                              {employee.attendanceData.map((day) => {
                                const status = STATUS_CONFIG[day.status]
                                return (
                                  <tr
                                    key={day.date}
                                    className="hover:bg-violet-core/5 transition-colors cursor-pointer"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onDayClick?.(employee, day)
                                    }}
                                  >
                                    <td className="py-2.5 font-semibold text-cloud">
                                      {formatDisplayDate(day.date)}
                                    </td>
                                    <td className="py-2.5">
                                      <div className="flex items-center gap-1.5">
                                        <div
                                          className={cn('w-1.5 h-1.5 rounded-full', status.dotColor)}
                                          aria-hidden
                                        />
                                        <span className="text-slate-300">{status.label}</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5">
                                      <div className="flex items-center gap-1.5 font-mono text-cloud">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                                        {day.timeIn || '--:--'}
                                      </div>
                                    </td>
                                    <td className="py-2.5">
                                      <div className="flex items-center gap-1.5 font-mono text-cloud">
                                        <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                                        {day.timeOut || '--:--'}
                                      </div>
                                    </td>
                                    <td className="py-2.5 font-mono text-cloud">
                                      {day.workHours || '--'}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
