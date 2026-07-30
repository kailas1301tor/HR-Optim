// components/payroll/payroll-toolbar.tsx
'use client'

import { Download, FileText } from 'lucide-react'
import { CommonListToolbar } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PrimaryButton } from '@/components/ui/primary-button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiInput, uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { payrollStatusFilterConfig } from './payroll-constants'
import type { Employee } from '@/types/employee'
import type { PayrollStatusFilter } from '@/types/payroll'

const STATUS_FILTER_OPTIONS: { value: PayrollStatusFilter; label: string }[] = [
  { value: 'all', label: payrollStatusFilterConfig.all.label },
  { value: 'processing', label: payrollStatusFilterConfig.processing.label },
  { value: 'finalized', label: payrollStatusFilterConfig.finalized.label },
]

const payrollControlClass = 'h-10 min-h-10 text-xs'
const payrollEmployeeSearchClass = 'w-full sm:w-44'
const payrollEmployeeSelectClass = 'w-full sm:w-44'
const payrollStatusSelectClass = 'w-full sm:w-40'
const payrollActionBtnClass = 'h-10 min-h-10 gap-2 text-xs shrink-0 whitespace-nowrap'

function getEmployeeFilterLabel(employee: Employee): string {
  const name = employee.full_name?.trim()
  if (name) {
    return employee.employee_id ? `${name} (${employee.employee_id})` : name
  }

  const email = employee.user?.email?.trim()
  if (email) return email

  const username = employee.user?.username?.trim()
  if (username) return username

  return employee.employee_id ? `Employee (${employee.employee_id})` : 'Employee'
}

const payrollEmployeeItemClass =
  'text-slate-200 focus:bg-violet-core/20 focus:text-white data-[highlighted]:bg-violet-core/20 data-[highlighted]:text-white'

interface PayrollToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  employeeFilter: number | null
  employees: Employee[]
  isEmployeesLoading: boolean
  employeesHasError?: boolean
  employeeSearchQuery: string
  onEmployeeSearchChange: (query: string) => void
  onEmployeeChange: (employeeId: number | null) => void
  statusFilter: PayrollStatusFilter
  onStatusChange: (status: PayrollStatusFilter) => void
  selectedCount: number
  isFinalizing: boolean
  onFinalizeSelected: () => void
  isExporting: boolean
  canExport: boolean
  onExportExcel: () => void
  onExportDepartmentSummary: () => void
  onGeneratePayroll: () => void
  canManage?: boolean
}

export function PayrollToolbar({
  searchQuery,
  onSearchChange,
  employeeFilter,
  employees,
  isEmployeesLoading,
  employeesHasError = false,
  employeeSearchQuery,
  onEmployeeSearchChange,
  onEmployeeChange,
  statusFilter,
  onStatusChange,
  selectedCount,
  isFinalizing,
  onFinalizeSelected,
  isExporting,
  canExport,
  onExportExcel,
  onExportDepartmentSummary,
  onGeneratePayroll,
  canManage = false,
}: PayrollToolbarProps) {
  return (
    <CommonListToolbar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search in list..."
      searchAriaLabel="Search payroll list"
      filters={
        <>
          <Input
            value={employeeSearchQuery}
            onChange={(e) => onEmployeeSearchChange(e.target.value)}
            placeholder="Search employees..."
            aria-label="Search employees for filter"
            className={cn(payrollControlClass, payrollEmployeeSearchClass, uiInput)}
            disabled={isEmployeesLoading}
          />
          <Select
            value={employeeFilter !== null ? String(employeeFilter) : 'all'}
            onValueChange={(val) => onEmployeeChange(val === 'all' ? null : Number(val))}
            disabled={isEmployeesLoading}
          >
            <SelectTrigger
              className={cn(payrollControlClass, payrollEmployeeSelectClass, uiSelect)}
              aria-label="Filter by employee"
            >
              <SelectValue placeholder={isEmployeesLoading ? 'Loading...' : 'All employees'} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="max-h-60 w-[var(--radix-select-trigger-width)] bg-slate-900 border-slate-700 text-slate-200 shadow-xl"
            >
              <SelectGroup>
                <SelectItem value="all" className={payrollEmployeeItemClass}>
                  All employees
                </SelectItem>
              </SelectGroup>
              {isEmployeesLoading ? (
                <SelectGroup>
                  <SelectLabel className="px-2 py-2 text-slate-500 font-normal">
                    Loading employees...
                  </SelectLabel>
                </SelectGroup>
              ) : employeesHasError ? (
                <SelectGroup>
                  <SelectLabel className="px-2 py-2 text-slate-500 font-normal">
                    Could not load employees
                  </SelectLabel>
                </SelectGroup>
              ) : employees.length === 0 ? (
                <SelectGroup>
                  <SelectLabel className="px-2 py-2 text-slate-500 font-normal">
                    No employees found
                  </SelectLabel>
                </SelectGroup>
              ) : (
                <SelectGroup>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={String(employee.id)}
                      className={payrollEmployeeItemClass}
                    >
                      <span className="truncate">{getEmployeeFilterLabel(employee)}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as PayrollStatusFilter)}>
            <SelectTrigger
              className={cn(payrollControlClass, payrollStatusSelectClass, uiSelect)}
              aria-label="Filter by status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              {STATUS_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      actions={
        canManage ? (
          <>
            {selectedCount > 0 ? (
              <PrimaryButton
                type="button"
                onClick={onFinalizeSelected}
                disabled={isFinalizing}
                isLoading={isFinalizing}
                className={payrollActionBtnClass}
              >
                Finalize ({selectedCount})
              </PrimaryButton>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className={cn(uiOutlineBtn, payrollActionBtnClass)}
              onClick={onExportExcel}
              disabled={isExporting || !canExport}
              aria-label="Export payroll to Excel"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export Excel'}</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn(uiOutlineBtn, payrollActionBtnClass)}
              onClick={onExportDepartmentSummary}
              disabled={isExporting || !canExport}
              aria-label="Export department payroll summary"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Dept Summary</span>
              <span className="sm:hidden">Dept</span>
            </Button>
            <PrimaryButton type="button" onClick={onGeneratePayroll} className={payrollActionBtnClass}>
              <FileText className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Generate Payroll</span>
              <span className="sm:hidden">Generate</span>
            </PrimaryButton>
          </>
        ) : null
      }
    />
  )
}
