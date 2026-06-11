// components/employees/employees-toolbar.tsx
'use client'

import { Plus } from 'lucide-react'
import { CommonListToolbar } from '@/components/common'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { DropdownData } from '@/types/employee'
interface EmployeesToolbarProps {
  localSearch: string
  onSearchChange: (query: string) => void
  departmentFilter: string
  statusFilter: string
  dropdowns: DropdownData | null
  onDepartmentChange: (val: string) => void
  onStatusChange: (val: string) => void
  onAddEmployee: () => void
}

export function EmployeesToolbar({
  localSearch,
  onSearchChange,
  departmentFilter,
  statusFilter,
  dropdowns,
  onDepartmentChange,
  onStatusChange,
  onAddEmployee,
}: EmployeesToolbarProps) {
  return (
    <CommonListToolbar
      searchQuery={localSearch}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search employees..."
      searchAriaLabel="Search employees"
      filters={
        <>
          <Select
            value={departmentFilter || 'all'}
            onValueChange={(val) => onDepartmentChange(val === 'all' ? '' : val)}
          >
            <SelectTrigger className={cn('w-full sm:w-44 text-xs', uiSelect)} aria-label="Filter by department">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              <SelectItem value="all">All Departments</SelectItem>
              {dropdowns?.departments.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter || 'all'}
            onValueChange={(val) => onStatusChange(val === 'all' ? '' : val)}
          >
            <SelectTrigger className={cn('w-full sm:w-40 text-xs', uiSelect)} aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              {dropdowns?.status_choices.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      actions={
        <>
          <PrimaryButton type="button" onClick={onAddEmployee} className="gap-2 text-xs flex-1 sm:flex-none sm:hidden">
            <Plus className="w-4 h-4" />
            Add
          </PrimaryButton>
        </>
      }
    />
  )
}
