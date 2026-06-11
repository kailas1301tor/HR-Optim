// components/payroll/payroll-dashboard.tsx
'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonPagination,
} from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiTableShell } from '@/lib/ui/design-system'
import {
  DollarSign,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react'
import { PayrollTrendsChart } from './payroll-trends-chart'
import { PayrollTableRow } from './payroll-table-row'
import { PayrollToolbar } from './payroll-toolbar'
import { usePayrollFilters } from './usePayrollFilters'
import { usePayrollList } from './usePayrollList'
import { usePayrollDashboard } from './usePayrollDashboard'
import { usePayrollActions } from './usePayrollActions'
import { usePayrollEmployeeSearch } from './usePayrollEmployeeSearch'
import { GeneratePayrollDialog } from './generate-payroll-dialog'
import { PayrollAdjustmentDialog } from './payroll-adjustment-dialog'
import type { PayrollRecord } from '@/types/payroll'
import { usePermissions } from '@/components/auth/permissions-provider'

function PayrollTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-12 rounded-[16px] [corner-shape:squircle] bg-midnight/60 animate-pulse" />
      ))}
    </div>
  )
}

function formatPeriodRange(startDate: string, endDate: string): string {
  const format = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return `${format(startDate)} – ${format(endDate)}`
}

function computeKpisFromRecords(records: PayrollRecord[]) {
  return records.reduce(
    (acc, record) => ({
      totalPayroll: acc.totalPayroll + record.grossSalary,
      totalDeductions: acc.totalDeductions + record.deductions,
      netPayout: acc.netPayout + record.netSalary,
      employeeCount: acc.employeeCount + 1,
    }),
    { totalPayroll: 0, totalDeductions: 0, netPayout: 0, employeeCount: 0 },
  )
}

export function PayrollDashboard() {
  const [dashboardReloadToken, setDashboardReloadToken] = useState(0)
  const { canManage } = usePermissions()
  const canManagePayroll = canManage('payroll')

  const {
    month,
    year,
    page,
    monthLabel,
    searchQuery,
    setSearchQuery,
    listParams,
    payPeriod,
    navigateMonth,
    setPage,
    employeeFilter,
    setEmployeeFilter,
    statusFilter,
    setStatusFilter,
    exportParams,
  } = usePayrollFilters()

  const { employees, isEmployeesLoading } = usePayrollEmployeeSearch()

  const handleSuccess = useCallback(() => {
    setDashboardReloadToken((token) => token + 1)
  }, [])

  const {
    paginatedRecords,
    filteredRecords,
    isLoading,
    hasError,
    errorMessage,
    totalCount,
    totalPages,
    currentPage,
    selectedIds,
    toggleSelected,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    hasSelectableRows,
    reload,
  } = usePayrollList({
    listParams,
    payPeriod,
    searchQuery,
    page,
    reloadToken: dashboardReloadToken,
  })

  const { dashboard, isDashboardLoading } = usePayrollDashboard({
    month,
    year,
    reloadToken: dashboardReloadToken,
  })

  const {
    isGenerateOpen,
    setIsGenerateOpen,
    isGenerating,
    handleGenerate,
    adjustmentTarget,
    setAdjustmentTarget,
    isAdjusting,
    handleAddAdjustment,
    isFinalizing,
    handleFinalize,
    handleExportWps,
    handleExportDepartmentSummary,
    isExporting,
  } = usePayrollActions({
    onSuccess: () => {
      handleSuccess()
      reload()
    },
    exportParams,
  })

  const handleFinalizeSelected = async () => {
    const ids = Array.from(selectedIds)
    await handleFinalize(ids)
    clearSelection()
  }

  const periodLabel = formatPeriodRange(payPeriod.start_date, payPeriod.end_date)

  const selectedEmployeeName = useMemo(() => {
    if (employeeFilter === null) return null
    return employees.find((employee) => employee.id === employeeFilter)?.full_name ?? null
  }, [employeeFilter, employees])

  const displayKpis = useMemo(() => {
    const apiKpis = dashboard.kpis
    const useFallback =
      !isDashboardLoading &&
      apiKpis.employeeCount === 0 &&
      filteredRecords.length > 0

    if (useFallback) {
      return { ...computeKpisFromRecords(filteredRecords), isFromList: true }
    }

    return {
      totalPayroll: apiKpis.totalPayroll,
      totalDeductions: apiKpis.totalDeductions,
      netPayout: apiKpis.netPayout,
      employeeCount: apiKpis.employeeCount,
      isFromList: false,
    }
  }, [dashboard.kpis, filteredRecords, isDashboardLoading])

  const emptyDescription = selectedEmployeeName
    ? `No payroll for ${selectedEmployeeName} in pay period ${periodLabel}.`
    : `No payroll for pay period ${periodLabel}. Generate payroll for this period or try another month.`

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-violet-core/20">
                <DollarSign className="w-5 h-5 text-violet-glow" />
              </div>
              <TrendingUp className="w-4 h-4 text-lime-400" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Total Payroll</p>
            <p className="text-2xl font-semibold text-cloud font-mono">
              {isDashboardLoading ? '—' : `AED ${displayKpis.totalPayroll.toLocaleString()}`}
            </p>
          </div>
          <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-red-400/20">
                <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
            <p className="text-2xl font-semibold text-cloud font-mono">
              {isDashboardLoading ? '—' : `AED ${displayKpis.totalDeductions.toLocaleString()}`}
            </p>
          </div>
          <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-lime-400/20">
                <DollarSign className="w-5 h-5 text-lime-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Net Payout</p>
            <p className="text-2xl font-semibold text-lime-400 font-mono">
              {isDashboardLoading ? '—' : `AED ${displayKpis.netPayout.toLocaleString()}`}
            </p>
          </div>
          <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-teal-400/20">
                <Users className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Employees</p>
            <p className="text-2xl font-semibold text-cloud font-mono">
              {isDashboardLoading ? '—' : displayKpis.employeeCount}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {displayKpis.isFromList
            ? `Totals from current pay period list (${periodLabel})`
            : `KPIs for ${monthLabel}`}
        </p>
      </div>

      <PayrollTrendsChart data={dashboard.trends} isLoading={isDashboardLoading} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 py-2 bg-midnight rounded-[16px] [corner-shape:squircle] min-w-32 text-center">
              <span className="text-sm font-medium text-cloud">{monthLabel}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-left sm:ml-1">
            Pay period: {periodLabel}
          </p>
        </div>

        <PayrollToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          employeeFilter={employeeFilter}
          employees={employees}
          isEmployeesLoading={isEmployeesLoading}
          onEmployeeChange={setEmployeeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedCount={selectedIds.size}
          isFinalizing={isFinalizing}
          onFinalizeSelected={handleFinalizeSelected}
          isExporting={isExporting}
          canExport={!isLoading && filteredRecords.length > 0}
          onExportExcel={handleExportWps}
          onExportDepartmentSummary={handleExportDepartmentSummary}
          onGeneratePayroll={() => setIsGenerateOpen(true)}
          canManage={canManagePayroll}
        />
      </div>

      {hasError ? (
        <CommonErrorState
          title="Failed to load payroll"
          message={errorMessage ?? 'Please check your connection and try again.'}
          onRetry={reload}
        />
      ) : isLoading ? (
        <div className={uiTableShell}>
          <PayrollTableSkeleton />
        </div>
      ) : filteredRecords.length === 0 ? (
        <CommonEmptyState
          icon={FileSpreadsheet}
          title="No payroll records"
          description={emptyDescription}
          actions={
            canManagePayroll ? (
            <PrimaryButton onClick={() => setIsGenerateOpen(true)}>
              Generate Payroll
            </PrimaryButton>
            ) : undefined
          }
        />
      ) : (
        <div className={`${uiTableShell} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 w-12">
                    {hasSelectableRows && canManagePayroll ? (
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
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
                {paginatedRecords.map((record, index) => (
                  <PayrollTableRow
                    key={record.id}
                    record={record}
                    index={index}
                    isSelected={selectedIds.has(record.id)}
                    onToggleSelect={toggleSelected}
                    onAddAdjustment={setAdjustmentTarget}
                    canManage={canManagePayroll}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      )}

      <GeneratePayrollDialog
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        payPeriod={payPeriod}
        isSubmitting={isGenerating}
        onSubmit={handleGenerate}
      />

      <PayrollAdjustmentDialog
        open={adjustmentTarget !== null}
        onOpenChange={(open) => !open && setAdjustmentTarget(null)}
        target={adjustmentTarget}
        isSubmitting={isAdjusting}
        onSubmit={handleAddAdjustment}
      />
    </div>
  )
}
