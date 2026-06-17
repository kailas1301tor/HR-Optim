// app/employees/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { TableSkeleton } from '@/components/common'
import { EmployeesList } from '@/components/employees/employees-list'

export default function EmployeesPage() {
  return (
    <AppShell>
      <Suspense fallback={<TableSkeleton showFilterChips filterChipCount={3} />}>
        <EmployeesList />
      </Suspense>
    </AppShell>
  )
}
