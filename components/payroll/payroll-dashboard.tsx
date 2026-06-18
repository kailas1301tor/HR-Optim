// components/payroll/payroll-dashboard.tsx
'use client'

import { ModuleRestrictedState, SelfServiceModuleTabs } from '@/components/common'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import { AdminPayrollDashboard } from './admin-payroll-dashboard'
import { EmployeePayrollView } from './employee-payroll-view'
import { PayrollSkeleton } from './payroll-skeleton'

export function PayrollDashboard() {
  const payrollGate = useModuleGate('payroll')

  if (payrollGate.isLoading) {
    return <PayrollSkeleton variant="admin" showHeader={false} />
  }

  if (payrollGate.isRestricted) {
    return <ModuleRestrictedState moduleKey="payroll" />
  }

  return (
    <SelfServiceModuleTabs
      showAdminView={payrollGate.showAdminView}
      showPersonalView={payrollGate.showPersonalView}
      teamContent={<AdminPayrollDashboard />}
      mineContent={<EmployeePayrollView embedded={payrollGate.isCombinedView} />}
    />
  )
}
