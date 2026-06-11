import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageHeader, CommonPageSkeleton } from '@/components/common'
import { PayrollDashboard } from '@/components/payroll/payroll-dashboard'

export default function PayrollPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <CommonPageHeader
          title="Payroll"
          subtitle="Manage employee salaries and WPS processing"
        />
        <Suspense fallback={<CommonPageSkeleton />}>
          <PayrollDashboard />
        </Suspense>
      </div>
    </AppShell>
  )
}
