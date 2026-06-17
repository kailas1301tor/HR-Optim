// components/payroll/payroll-dashboard.tsx
'use client'

import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminPayrollDashboard } from './admin-payroll-dashboard'
import { EmployeePayrollView } from './employee-payroll-view'
import { PayrollSkeleton } from './payroll-skeleton'

export function PayrollDashboard() {
  const payrollGate = useModuleGate('payroll')

  if (payrollGate.shouldRenderPersonalView) {
    return <EmployeePayrollView />
  }

  if (payrollGate.isLoading) {
    return <PayrollSkeleton variant="admin" showHeader={false} />
  }

  return <AdminPayrollDashboard />
}
