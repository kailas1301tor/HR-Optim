// components/employees/employees-page-header.tsx
'use client'

import { Plus } from 'lucide-react'
import { CommonPageHeader } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'

interface EmployeesPageHeaderProps {
  onAddEmployee: () => void
  canManage?: boolean
}

export function EmployeesPageHeader({ onAddEmployee, canManage = false }: EmployeesPageHeaderProps) {
  return (
    <CommonPageHeader
      title="Employees"
      subtitle="Manage your workforce and employee information"
      action={
        canManage ? (
        <PrimaryButton onClick={onAddEmployee} className="gap-2 w-full sm:w-auto hidden sm:inline-flex">
          <Plus className="w-4 h-4" />
          Add Employee
        </PrimaryButton>
        ) : undefined
      }
    />
  )
}
