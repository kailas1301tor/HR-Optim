// components/employees/employees-table.tsx
'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { CommonPagination } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock, uiTableShell } from '@/lib/ui/design-system'
import { EmployeeTableRow } from './employee-table-row'
import type { Employee } from '@/types/employee'

interface EmployeesTableProps {
  employees: Employee[]
  isLoading: boolean
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  onSelect: (employee: Employee) => void
  onToggleStatus: (employee: Employee, active: boolean) => void
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
  onPageChange: (page: number) => void
  canManage?: boolean
}

const TABLE_COLUMNS = [
  { id: 'employee', label: 'Employee' },
  { id: 'department', label: 'Department' },
  { id: 'position', label: 'Position' },
  { id: 'status', label: 'Status' },
  { id: 'active', label: 'Active' },
  { id: 'joined', label: 'Join Date' },
] as const

export function EmployeesTable({
  employees,
  isLoading,
  pagination,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
  onPageChange,
  canManage = false,
}: EmployeesTableProps) {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {TABLE_COLUMNS.map((col) => (
                <th key={col.id} className="text-left px-4 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {col.label}
                  </span>
                </th>
              ))}
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
              employees.map((employee, index) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  index={index}
                  onSelect={() => onSelect(employee)}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  canManage={canManage}
                />
              ))
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
