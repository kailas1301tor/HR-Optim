// components/employees/employees-table.tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonPagination } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock, uiTableShell } from '@/lib/ui/design-system'
import { EmployeeTableRow } from './employee-table-row'
import type { Employee } from './employee-table-types'

type SortField = 'full_name' | 'department' | 'designation' | 'joined_date' | 'status'

interface EmployeesTableProps {
  employees: Employee[]
  isLoading: boolean
  sortField: SortField
  sortOrder: 'asc' | 'desc'
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  onSort: (field: SortField) => void
  onSelect: (employee: Employee) => void
  onToggleStatus: (employee: Employee, active: boolean) => void
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
  onPageChange: (page: number) => void
}

export function EmployeesTable({
  employees,
  isLoading,
  sortField,
  sortOrder,
  pagination,
  onSort,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
  onPageChange,
}: EmployeesTableProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
  }

  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[
                { id: 'full_name', label: 'Employee' },
                { id: 'department', label: 'Department' },
                { id: 'designation', label: 'Position' },
                { id: 'status', label: 'Status' },
              ].map((col) => (
                <th key={col.id} className="text-left px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSort(col.id as SortField)}
                    className="flex items-center text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-cloud transition-colors"
                  >
                    {col.label}
                    <SortIcon field={col.id as SortField} />
                  </button>
                </th>
              ))}
              <th className="text-left px-4 py-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Active</span>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort('joined_date')}
                  className="flex items-center text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-cloud transition-colors"
                >
                  Join Date
                  <SortIcon field="joined_date" />
                </button>
              </th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className={cn('w-9 h-9 rounded-full shrink-0', uiSkeletonBlock)} />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className={cn('h-3 rounded w-24', uiSkeletonBlock)} />
                        <Skeleton className={cn('h-2 rounded w-16', uiSkeletonBlock)} />
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className={cn('h-4 rounded w-20', uiSkeletonBlock)} />
                    </td>
                  ))}
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : (
              <AnimatePresence>
                {employees.map((employee, index) => (
                  <EmployeeTableRow
                    key={employee.id}
                    employee={employee}
                    index={index}
                    onSelect={() => onSelect(employee)}
                    onToggleStatus={onToggleStatus}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
      <CommonPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  )
}
