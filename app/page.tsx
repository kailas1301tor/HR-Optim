// app/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SelfServicePageHeader } from '@/components/common'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import { ManualAttendancePunch } from '@/components/dashboard/manual-attendance-punch'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SelfServicePageHeader
          moduleKey="dashboard"
          title="Dashboard"
          subtitle="Here's what's happening with your team today."
        />
        <div className="flex justify-start">
          <ManualAttendancePunch className="w-full md:max-w-xl lg:max-w-2xl" />
        </div>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </AppShell>
  )
}
