// components/attendance/attendance-toolbar.tsx
'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CommonListToolbar } from '@/components/common'
import { uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { FrontendShift } from '@/types/settings'

interface AttendanceToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  shiftFilter: string
  onShiftChange: (value: string) => void
  shifts: FrontendShift[]
  shiftsError: boolean
  isExporting: boolean
  isLoading: boolean
  canExport: boolean
  onExport: () => void
  onDeptExport?: () => void
}

export function AttendanceToolbar({
  searchQuery,
  onSearchChange,
  shiftFilter,
  onShiftChange,
  shifts,
  shiftsError,
  isExporting,
  isLoading,
  canExport,
  onExport,
  onDeptExport,
}: AttendanceToolbarProps) {
  return (
    <CommonListToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search employees..."
      searchAriaLabel="Search attendance records"
      filters={
        <Select value={shiftFilter} onValueChange={onShiftChange} disabled={shiftsError}>
          <SelectTrigger className={cn(uiSelect, 'w-full sm:w-40')}>
            <SelectValue placeholder={shiftsError ? 'Shifts unavailable' : 'Filter by shift'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {shifts.map((shift) => (
              <SelectItem key={shift.id} value={String(shift.id)}>
                {shift.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      actions={
        <>
          {onDeptExport ? (
            <Button
              variant="outline"
              className={cn(uiOutlineBtn, 'gap-2 justify-center min-h-11')}
              onClick={onDeptExport}
              disabled={isExporting || isLoading || !canExport}
              aria-label="Export department attendance"
            >
              <Download className="w-4 h-4" aria-hidden />
              {isExporting ? 'Exporting…' : 'Dept Export'}
            </Button>
          ) : null}
          <Button
            variant="outline"
            className={cn(uiOutlineBtn, 'gap-2 justify-center min-h-11')}
            onClick={onExport}
            disabled={isExporting || isLoading || !canExport}
            aria-label="Export attendance to Excel"
          >
            <Download className="w-4 h-4" aria-hidden />
            {isExporting ? 'Exporting…' : 'Export'}
          </Button>
        </>
      }
    />
  )
}
