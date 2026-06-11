// components/payroll/payroll-toolbar.tsx
'use client'

import { Download, FileText } from 'lucide-react'
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
import { payrollStatusFilterConfig } from './payroll-constants'
import type { Employee } from '@/types/employee'
import type { PayrollStatusFilter } from '@/types/payroll'

const STATUS_FILTER_OPTIONS: { value: PayrollStatusFilter; label: string }[] = [
  { value: 'all', label: payrollStatusFilterConfig.all.label },
  { value: 'processing', label: payrollStatusFilterConfig.processing.label },
  { value: 'finalized', label: payrollStatusFilterConfig.finalized.label },
]

interface PayrollToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  employeeFilter: number | null
  employees: Employee[]
  isEmployeesLoading: boolean
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
          <Select
            value={employeeFilter !== null ? String(employeeFilter) : 'all'}
            onValueChange={(val) => onEmployeeChange(val === 'all' ? null : Number(val))}
            disabled={isEmployeesLoading}
          >
            <SelectTrigger
              className={cn('w-full sm:w-44 text-xs', uiSelect)}
              aria-label="Filter by employee"
            >
              <SelectValue placeholder={isEmployeesLoading ? 'Loading...' : 'All employees'} />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              <SelectItem value="all">All employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => onStatusChange(val as PayrollStatusFilter)}>
            <SelectTrigger
              className={cn('w-full sm:w-40 text-xs', uiSelect)}
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
              className="gap-2 text-xs flex-1 sm:flex-none"
            >
              Finalize ({selectedCount})
            </PrimaryButton>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className={cn(uiOutlineBtn, 'gap-2 text-xs flex-1 sm:flex-none')}
            onClick={onExportExcel}
            disabled={isExporting || !canExport}
            aria-label="Export payroll to Excel"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export Excel'}</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(uiOutlineBtn, 'gap-2 text-xs flex-1 sm:flex-none')}
            onClick={onExportDepartmentSummary}
            disabled={isExporting || !canExport}
            aria-label="Export department payroll summary"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Dept Summary</span>
            <span className="sm:hidden">Dept</span>
          </Button>
          <PrimaryButton
            type="button"
            onClick={onGeneratePayroll}
            className="gap-2 text-xs flex-1 sm:flex-none"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Payroll</span>
            <span className="sm:hidden">Generate</span>
          </PrimaryButton>
        </>
        ) : null
      }
    />
  )
}
