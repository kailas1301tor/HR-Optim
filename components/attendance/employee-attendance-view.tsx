// components/attendance/employee-attendance-view.tsx
'use client'

import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  CalendarRange,
  ShieldAlert,
  Palmtree,
} from 'lucide-react'
import { usePermissions } from '@/components/auth/permissions-provider'
import { CommonEmptyState, CommonErrorBanner, MonthYearPicker } from '@/components/common'
import { uiCard } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types/attendance'
import { AttendanceSkeleton } from './attendance-skeleton'
import { useEmployeeAttendance } from './useEmployeeAttendance'

const statusConfig: Record<
  AttendanceStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  present: { label: 'Present', dotColor: 'bg-lime-400', textColor: 'text-lime-400' },
  late: { label: 'Late', dotColor: 'bg-amber-400', textColor: 'text-amber-400' },
  absent: { label: 'Absent', dotColor: 'bg-red-400', textColor: 'text-red-400' },
  leave: { label: 'On Leave', dotColor: 'bg-violet-glow', textColor: 'text-violet-glow' },
  weekend: { label: 'Weekend', dotColor: 'bg-slate-400', textColor: 'text-slate-400' },
  holiday: { label: 'Holiday', dotColor: 'bg-teal-400', textColor: 'text-teal-400' },
}

function getCurrentMonthYear() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function EmployeeAttendanceView({ embedded = false }: { embedded?: boolean }) {
  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthYear)

  const { data, isLoading, hasError, errorMessage, reload } = useEmployeeAttendance({
    employeeProfileId,
    month,
    year,
    enabled: !isAuthLoading && employeeProfileId !== null,
  })

  const handleMonthChange = (nextMonth: number) => setMonthYear((prev) => ({ ...prev, month: nextMonth }))
  const handleYearChange = (nextYear: number) => setMonthYear((prev) => ({ ...prev, year: nextYear }))

  const { summary, days } = data

  if (isAuthLoading || isLoading) {
    return <AttendanceSkeleton variant="employee" />
  }

  if (!employeeProfileId) {
    return (
      <div className={cn(uiCard, 'p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12 border-amber-500/20 bg-amber-500/5')}>
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-cloud mb-2">No Employee Profile Linked</h3>
        <p className="text-sm text-muted-foreground">
          This account is not linked to any employee profile. Please contact your system administrator to configure your employee profile link.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-end gap-4',
          embedded ? 'sm:justify-end' : 'sm:justify-between',
        )}
      >
        {!embedded ? (
          <div>
            <h1 className="text-2xl font-bold text-cloud">My Attendance</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Review your monthly attendance summary and daily status
            </p>
          </div>
        ) : null}
        <MonthYearPicker
          month={month}
          year={year}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      </div>

      {hasError ? (
        <CommonErrorBanner message={errorMessage ?? 'Failed to load attendance'} onRetry={reload} />
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={cn(uiCard, 'p-5 flex items-center gap-4 bg-lime-400/5 border-lime-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-lime-400/10 text-lime-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Present</p>
            <p className="text-lg font-bold text-cloud font-mono tracking-tight mt-0.5">{summary.present}</p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-5 flex items-center gap-4 bg-red-500/5 border-red-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-red-500/10 text-red-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Absent</p>
            <p className="text-lg font-bold text-cloud font-mono tracking-tight mt-0.5">{summary.absent}</p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-5 flex items-center gap-4 bg-violet-core/5 border-violet-core/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 text-violet-glow">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">On Leave</p>
            <p className="text-lg font-bold text-cloud font-mono tracking-tight mt-0.5">{summary.leave}</p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-5 flex items-center gap-4 bg-teal-400/5 border-teal-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-teal-400/10 text-teal-400">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Holiday</p>
            <p className="text-lg font-bold text-cloud font-mono tracking-tight mt-0.5">{summary.holiday}</p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-5 flex items-center gap-4 bg-slate-500/5 border-slate-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-slate-500/10 text-slate-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Weekend</p>
            <p className="text-lg font-bold text-cloud font-mono tracking-tight mt-0.5">{summary.weekend}</p>
          </div>
        </div>
      </div>

      {days.length > 0 ? (
        <div className={cn(uiCard, 'p-6 overflow-hidden')}>
          <h2 className="text-sm font-semibold text-cloud mb-4">Daily Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Day</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {days.map((day) => {
                  const status = statusConfig[day.status] ?? statusConfig.absent
                  return (
                    <tr key={day.date} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3.5 font-semibold text-cloud">
                        {day.date
                          ? new Date(day.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="py-3.5 text-muted-foreground">{day.dayOfWeek || '—'}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={cn('w-1.5 h-1.5 rounded-full', status.dotColor)} />
                          <span className={cn('font-semibold', status.textColor)}>{status.label}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !hasError ? (
        <CommonEmptyState
          icon={Calendar}
          title="No attendance data"
          description="No attendance records are available for the selected month."
        />
      ) : null}
    </div>
  )
}
