// components/attendance/attendance-table.tsx
'use client'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { uiTableShell } from '@/lib/ui/design-system'
import { STATUS_CONFIG, getShiftBadgeClassName } from './attendance-constants'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceTableProps {
  records: AttendanceRecord[]
}

const TABLE_COLUMNS = [
  { id: 'employee', label: 'Employee' },
  { id: 'shift', label: 'Shift' },
  { id: 'status', label: 'Status' },
  { id: 'timeIn', label: 'Time In' },
  { id: 'timeOut', label: 'Time Out' },
  { id: 'workHours', label: 'Work Hours' },
] as const

export function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-border/50 hover:bg-violet-core/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
                        {record.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-cloud">{record.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{record.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-[11px] font-medium',
                      getShiftBadgeClassName(record.shiftName),
                    )}
                  >
                    {record.shiftName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[record.status].dotColor)}
                      aria-hidden
                    />
                    <span className="text-sm text-slate-300">{STATUS_CONFIG[record.status].label}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" aria-hidden />
                    <span className="text-sm font-mono text-cloud">{record.timeIn || '--:--'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" aria-hidden />
                    <span className="text-sm font-mono text-cloud">{record.timeOut || '--:--'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-cloud">{record.workHours || '--'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
