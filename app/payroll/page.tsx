// app/payroll/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { SelfServicePageHeader } from '@/components/common'
import { PayrollDashboard } from '@/components/payroll/payroll-dashboard'
import { PayrollSkeleton } from '@/components/payroll/payroll-skeleton'

export default function PayrollPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SelfServicePageHeader
          moduleKey="payroll"
          title="Payroll"
          subtitle="Manage employee salaries and WPS processing"
        />
        <Suspense fallback={<PayrollSkeleton variant="employee" showHeader={false} />}>
          <PayrollDashboard />
        </Suspense>
      </div>
    </AppShell>
  )
}
