// components/payroll/payroll-table.tsx
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { CommonPagination } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiTableShell } from '@/lib/ui/design-system'
import { PayrollTableRow } from './payroll-table-row'
import type { PayrollRecord } from '@/types/payroll'

interface PayrollTableProps {
  records: PayrollRecord[]
  isLoading: boolean
  selectedIds: Set<number>
  isAllSelected: boolean
  hasSelectableRows: boolean
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onAddAdjustment: (record: PayrollRecord) => void
  currentPage: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  canManage?: boolean
}

function PayrollTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-12 rounded-[16px] [corner-shape:squircle] bg-midnight/60 animate-pulse" />
      ))}
    </div>
  )
}

export function PayrollTable({
  records,
  isLoading,
  selectedIds,
  isAllSelected,
  hasSelectableRows,
  onToggleSelect,
  onToggleSelectAll,
  onAddAdjustment,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  canManage = false,
}: PayrollTableProps) {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block overflow-hidden')}>
      {isLoading ? (
        <PayrollTableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 w-12">
                  {hasSelectableRows && canManage ? (
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={onToggleSelectAll}
                      aria-label="Select all processing payroll rows"
                    />
                  ) : null}
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Employee
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Base Salary
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Allowances
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Overtime
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Deductions
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Net Salary
                </th>
                <th className="text-center px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <PayrollTableRow
                  key={record.id}
                  record={record}
                  index={index}
                  isSelected={selectedIds.has(record.id)}
                  onToggleSelect={onToggleSelect}
                  onAddAdjustment={onAddAdjustment}
                  canManage={canManage}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    </div>
  )
}
