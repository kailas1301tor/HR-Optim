// app/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SelfServicePageHeader } from '@/components/common'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SelfServicePageHeader
          moduleKey="dashboard"
          title="Dashboard"
          subtitle="Here's what's happening with your team today."
        />
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </AppShell>
  )
}
