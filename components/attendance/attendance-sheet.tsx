// components/attendance/attendance-sheet.tsx
'use client'

import { ModuleRestrictedState, SelfServiceModuleTabs } from '@/components/common'
import { AttendanceSkeleton } from './attendance-skeleton'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminAttendanceSheet } from './admin-attendance-sheet'
import { EmployeeAttendanceView } from './employee-attendance-view'

export function AttendanceSheet() {
  const attendanceGate = useModuleGate('attendance')

  if (attendanceGate.isLoading) {
    return (
      <AttendanceSkeleton
        variant={attendanceGate.showAdminView ? 'admin' : 'employee'}
        showHeader={true}
        showStats={true}
        showFilters={attendanceGate.showAdminView}
      />
    )
  }

  if (attendanceGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="attendance" />
  }

  return (
    <SelfServiceModuleTabs
      showAdminView={attendanceGate.showAdminView}
      showPersonalView={attendanceGate.showPersonalView}
      teamContent={<AdminAttendanceSheet />}
      mineContent={<EmployeeAttendanceView embedded={attendanceGate.isCombinedView} />}
    />
  )
}
