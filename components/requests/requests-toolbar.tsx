// components/requests/requests-toolbar.tsx
'use client'

import { CommonFilterChips, CommonListToolbar } from '@/components/common'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiSelect } from '@/lib/ui/design-system'
import type { Employee } from '@/components/employees/employee-table'
import { typeConfig } from './requests-constants'
import type { RequestTypeFilter } from './useRequestsList'

const TYPE_FILTERS: { value: RequestTypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'leave', label: 'Leave' },
  { value: 'salary-advance', label: 'Salary Advance' },
  { value: 'loan', label: 'Loan' },
  { value: 'document', label: 'Document' },
]

interface RequestsToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  typeFilter: RequestTypeFilter
  onTypeChange: (type: RequestTypeFilter) => void
  employeeFilter: number | null
  employees: Employee[]
  isEmployeesLoading: boolean
  onEmployeeChange: (employeeId: number | null) => void
}

export function RequestsToolbar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  employeeFilter,
  employees,
  isEmployeesLoading,
  onEmployeeChange,
}: RequestsToolbarProps) {
  const chipOptions = TYPE_FILTERS.map((tab) => ({
    value: tab.value,
    label: tab.value === 'all' ? tab.label : typeConfig[tab.value]?.label ?? tab.label,
  }))

  return (
    <CommonListToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search requests..."
      searchAriaLabel="Search requests"
      filters={
        <Select
          value={employeeFilter !== null ? String(employeeFilter) : 'all'}
          onValueChange={(val) => onEmployeeChange(val === 'all' ? null : Number(val))}
          disabled={isEmployeesLoading}
        >
          <SelectTrigger className={`w-full lg:w-52 text-xs ${uiSelect}`} aria-label="Filter by employee">
            <SelectValue placeholder={isEmployeesLoading ? 'Loading...' : 'All employees'} />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            <SelectItem value="all">All employees</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      chips={
        <CommonFilterChips
          options={chipOptions}
          value={typeFilter}
          onChange={(val) => onTypeChange(val as RequestTypeFilter)}
        />
      }
    />
  )
}
