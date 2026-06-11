// components/requests/requests-toolbar.tsx
'use client'

import { CommonFilterChips, CommonListToolbar } from '@/components/common'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import type { Employee } from '@/types/employee'
import type { RequestTypeFilter } from '@/types/request'
import { typeConfig } from './requests-constants'

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
  employeeSearchQuery: string
  onEmployeeSearchChange: (query: string) => void
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
  employeeSearchQuery,
  onEmployeeSearchChange,
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
        <div className="flex w-full flex-col gap-2 lg:w-52">
          <Input
            value={employeeSearchQuery}
            onChange={(e) => onEmployeeSearchChange(e.target.value)}
            placeholder="Search employees..."
            aria-label="Search employees for filter"
            className={`h-9 text-xs ${uiInput}`}
          />
          <Select
            value={employeeFilter !== null ? String(employeeFilter) : 'all'}
            onValueChange={(val) => onEmployeeChange(val === 'all' ? null : Number(val))}
            disabled={isEmployeesLoading}
          >
            <SelectTrigger className={`w-full text-xs ${uiSelect}`} aria-label="Filter by employee">
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
        </div>
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
