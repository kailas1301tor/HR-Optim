import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageHeader, CommonPageSkeleton } from '@/components/common'
import { AttendanceSheet } from '@/components/attendance/attendance-sheet'

export default function AttendancePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommonPageHeader
          title="Attendance"
          subtitle="Track and manage daily employee attendance"
        />
        <Suspense fallback={<CommonPageSkeleton />}>
          <AttendanceSheet />
        </Suspense>
      </div>
    </AppShell>
  )
}
