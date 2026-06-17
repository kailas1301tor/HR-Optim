// app/attendance/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SelfServicePageHeader } from '@/components/common'
import { AttendanceSkeleton } from '@/components/attendance/attendance-skeleton'
import { AttendanceSheet } from '@/components/attendance/attendance-sheet'

export default function AttendancePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SelfServicePageHeader
          moduleKey="attendance"
          title="Attendance"
          subtitle="Track and manage daily employee attendance"
        />
        <Suspense fallback={<AttendanceSkeleton variant="employee" showHeader={true} showStats={true} />}>
          <AttendanceSheet />
        </Suspense>
      </div>
    </AppShell>
  )
}
