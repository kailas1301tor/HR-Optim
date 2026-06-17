// components/attendance/attendance-sheet.tsx
'use client'

import { AttendanceSkeleton } from './attendance-skeleton'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminAttendanceSheet } from './admin-attendance-sheet'
import { EmployeeAttendanceView } from './employee-attendance-view'

export function AttendanceSheet() {
  const attendanceGate = useModuleGate('attendance')

  if (attendanceGate.shouldRenderPersonalView) {
    return <EmployeeAttendanceView />
  }

  if (attendanceGate.isLoading) {
    return (
      <AttendanceSkeleton
        variant="admin"
        showHeader={true}
        showStats={true}
        showFilters={true}
      />
    )
  }

  return <AdminAttendanceSheet />
}
