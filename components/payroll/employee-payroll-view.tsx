// components/payroll/employee-payroll-view.tsx
'use client'

import { useState, useMemo } from 'react'
import { DollarSign, FileText, Download, TrendingUp, ShieldAlert } from 'lucide-react'
import { usePermissions } from '@/components/auth/permissions-provider'
import { CommonEmptyState, CommonErrorBanner, MonthYearPicker } from '@/components/common'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { uiCard, uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { PayrollRecord } from '@/types/payroll'
import { PayrollSkeleton } from './payroll-skeleton'
import { useEmployeePayroll } from './useEmployeePayroll'

function getCurrentMonthYear() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function EmployeePayrollView({ embedded = false }: { embedded?: boolean }) {
  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [{ month, year }, setMonthYear] = useState(getCurrentMonthYear)

  const { payrollHistory, isLoading, hasError, errorMessage, reload } = useEmployeePayroll({
    employeeProfileId,
    month,
    year,
    enabled: !isAuthLoading && employeeProfileId !== null,
  })

  const handleMonthChange = (nextMonth: number) => setMonthYear((prev) => ({ ...prev, month: nextMonth }))
  const handleYearChange = (nextYear: number) => setMonthYear((prev) => ({ ...prev, year: nextYear }))

  const stats = useMemo(() => {
    const totalEarnings = payrollHistory.reduce((sum, item) => sum + item.netSalary, 0)
    const count = payrollHistory.length
    const latestPay = count > 0 ? payrollHistory[0].netSalary : 0
    return { totalEarnings, count, latestPay }
  }, [payrollHistory])

  const handleDownloadPayslip = (record: PayrollRecord) => {
    toast.info(`Downloading payslip for ${new Date(record.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}...`)
    const fileContent = `HRMS PAYSLIP - ${record.employeeName}\nID: ${record.employeeId}\nPeriod: ${record.startDate} to ${record.endDate}\nBasic Salary: AED ${record.baseSalary}\nAllowances: AED ${record.allowances}\nOvertime: AED ${record.overtime}\nDeductions: AED ${record.deductions}\nNet Pay: AED ${record.netSalary}`
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payslip_${record.startDate}_${record.endDate}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isAuthLoading || isLoading) {
    return <PayrollSkeleton variant="employee" />
  }

  if (!employeeProfileId) {
    return (
      <div className={cn(uiCard, 'p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12 border-amber-500/20 bg-amber-500/5')}>
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-cloud mb-2">No Employee Profile Linked</h3>
        <p className="text-sm text-muted-foreground">
          This account is not linked to any employee profile. Please contact your system administrator to configure your employee profile link.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-end gap-4',
          embedded ? 'sm:justify-end' : 'sm:justify-between',
        )}
      >
        {!embedded ? (
          <div>
            <h1 className="text-2xl font-bold text-cloud">My Payroll</h1>
            <p className="text-xs text-muted-foreground mt-1">
              View your monthly salary statements and download payslips
            </p>
          </div>
        ) : null}
        <MonthYearPicker
          month={month}
          year={year}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      </div>

      {hasError ? (
        <CommonErrorBanner message={errorMessage ?? 'Failed to load payroll'} onRetry={reload} />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-teal-400/5 border-teal-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-teal-400/10 text-teal-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Latest Net Salary</p>
            <p className="text-xl font-bold text-cloud font-mono tracking-tight mt-0.5 min-h-7">
              AED {stats.latestPay.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-violet-core/5 border-violet-core/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 text-violet-glow">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Cumulative Payout</p>
            <p className="text-xl font-bold text-cloud font-mono tracking-tight mt-0.5 min-h-7">
              AED {stats.totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-lime-400/5 border-lime-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-lime-400/10 text-lime-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Processed Payslips</p>
            <p className="text-xl font-bold text-cloud font-mono tracking-tight mt-0.5 min-h-7">
              {stats.count}
            </p>
          </div>
        </div>
      </div>

      {payrollHistory.length > 0 ? (
        <div className={cn(uiCard, 'p-6 overflow-hidden')}>
          <h2 className="text-sm font-semibold text-cloud mb-4">Historical Statements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground">
                  <th className="pb-3 font-semibold">Pay Period</th>
                  <th className="pb-3 font-semibold font-mono">Base Salary</th>
                  <th className="pb-3 font-semibold font-mono">Allowances</th>
                  <th className="pb-3 font-semibold font-mono">Overtime</th>
                  <th className="pb-3 font-semibold font-mono">Deductions</th>
                  <th className="pb-3 font-semibold font-mono">Net Payout</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {payrollHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 font-semibold text-cloud">
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 font-mono text-slate-300">AED {item.baseSalary.toLocaleString()}</td>
                    <td className="py-4 font-mono text-slate-300">AED {item.allowances.toLocaleString()}</td>
                    <td className="py-4 font-mono text-lime-400">+AED {item.overtime.toLocaleString()}</td>
                    <td className="py-4 font-mono text-red-400">-AED {item.deductions.toLocaleString()}</td>
                    <td className="py-4 font-mono font-semibold text-cloud text-sm">
                      AED {item.netSalary.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-lime-500/10 text-lime-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadPayslip(item)}
                        className={cn(uiOutlineBtn, 'h-8 text-[10px] gap-1 px-2')}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Payslip
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : !hasError ? (
        <CommonEmptyState
          icon={DollarSign}
          title="No payslips available"
          description="Your monthly payslips will appear here once they are processed by the HR department."
        />
      ) : null}
    </div>
  )
}
