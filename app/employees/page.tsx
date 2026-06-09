import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { CommonPageSkeleton } from '@/components/common'
import { EmployeesList } from '@/components/employees/employees-list'

export default function EmployeesPage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <EmployeesList />
      </Suspense>
    </AppShell>
  )
}
