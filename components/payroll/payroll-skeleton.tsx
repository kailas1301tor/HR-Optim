// components/payroll/payroll-skeleton.tsx
'use client'

import { DollarSign, FileText, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonMobileCardGrid } from '@/components/common'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleLg,
  uiSquircleSm,
  uiTableShell,
} from '@/lib/ui/design-system'
import { PayrollCardSkeleton } from './payroll-card-skeleton'

interface PayrollSkeletonProps {
  variant?: 'admin' | 'employee'
  showHeader?: boolean
  className?: string
}

function AdminPayrollKpiSkeleton({ showTrendIcon = false }: { showTrendIcon?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className={cn('w-9 h-9 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
        {showTrendIcon ? (
          <Skeleton className={cn('w-4 h-4 rounded', uiSkeletonBlock)} />
        ) : (
          <span className="w-4 h-4" aria-hidden />
        )}
      </div>
      <Skeleton className={cn('h-3 w-24 rounded mb-2', uiSkeletonBlock)} />
      <Skeleton className={cn('h-8 w-28', uiSquircleSm, uiSkeletonBlock)} />
    </div>
  )
}

function PayrollTableSkeleton() {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {Array.from({ length: 6 }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <Skeleton className={cn('h-3 rounded w-16', uiSkeletonBlock)} />
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-border/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className={cn('w-9 h-9 rounded-full shrink-0', uiSkeletonBlock)} />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className={cn('h-3 rounded w-24', uiSkeletonBlock)} />
                      <Skeleton className={cn('h-2 rounded w-16', uiSkeletonBlock)} />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className={cn('h-4 rounded w-20', uiSkeletonBlock)} />
                  </td>
                ))}
                <td className="px-4 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EmployeePayrollSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading payroll" role="status">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cloud">My Payroll</h1>
          <p className="text-xs text-muted-foreground mt-1">
            View your monthly salary statements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className={cn('h-10 w-28', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-24', uiSquircleSm, uiSkeletonBlock)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-teal-400/5 border-teal-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-teal-400/10 text-teal-400">
            <DollarSign className="w-5 h-5" aria-hidden />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Latest Net Salary
            </p>
            <Skeleton className={cn('h-6 w-24', uiSkeletonBlock)} />
          </div>
        </div>

        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-violet-core/5 border-violet-core/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 text-violet-glow">
            <TrendingUp className="w-5 h-5" aria-hidden />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Cumulative Payout
            </p>
            <Skeleton className={cn('h-6 w-24', uiSkeletonBlock)} />
          </div>
        </div>

        <div className={cn(uiCard, 'p-6 flex items-center gap-4 bg-lime-400/5 border-lime-500/10')}>
          <div className="p-3 rounded-[16px] [corner-shape:squircle] bg-lime-400/10 text-lime-400">
            <FileText className="w-5 h-5" aria-hidden />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Processed Payslips
            </p>
            <Skeleton className={cn('h-6 w-12', uiSkeletonBlock)} />
          </div>
        </div>
      </div>

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
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  <td className="py-4"><Skeleton className={cn('h-4 w-16', uiSkeletonBlock)} /></td>
                  <td className="py-4 font-mono"><Skeleton className={cn('h-4 w-20', uiSkeletonBlock)} /></td>
                  <td className="py-4 font-mono"><Skeleton className={cn('h-4 w-20', uiSkeletonBlock)} /></td>
                  <td className="py-4 font-mono"><Skeleton className={cn('h-4 w-20', uiSkeletonBlock)} /></td>
                  <td className="py-4 font-mono"><Skeleton className={cn('h-4 w-20', uiSkeletonBlock)} /></td>
                  <td className="py-4 font-mono"><Skeleton className={cn('h-4 w-24', uiSkeletonBlock)} /></td>
                  <td className="py-4"><Skeleton className={cn('h-5 w-14 rounded-full', uiSkeletonBlock)} /></td>
                  <td className="py-4 text-right">
                    <Skeleton className={cn('h-8 w-16 ml-auto rounded', uiSkeletonBlock)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminPayrollSkeleton({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div className="space-y-6" aria-label="Loading payroll" role="status">
      {showHeader ? (
        <div className="space-y-2 pb-2 border-b border-border/40">
          <Skeleton className={cn('h-8 w-32 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-64 rounded', uiSkeletonBlock)} />
        </div>
      ) : null}

      <div className="space-y-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminPayrollKpiSkeleton showTrendIcon />
          <AdminPayrollKpiSkeleton />
          <AdminPayrollKpiSkeleton />
          <AdminPayrollKpiSkeleton />
        </div>
        <Skeleton className={cn('h-3 w-48 rounded mt-2', uiSkeletonBlock)} />
      </div>

      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className={cn('h-5 w-32 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-48 rounded', uiSkeletonBlock)} />
          </div>
          <div className="flex items-center gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <Skeleton className={cn('w-3 h-3 rounded-sm', uiSkeletonBlock)} />
                <Skeleton className={cn('h-3 w-12 rounded', uiSkeletonBlock)} />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className={cn('h-64 w-full rounded-[20px] [corner-shape:squircle]', uiSquircleLg, uiSkeletonBlock)} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Skeleton className={cn('h-10 w-10', uiSquircleSm, uiSkeletonBlock)} />
            <Skeleton className={cn('h-10 w-32 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
            <Skeleton className={cn('h-10 w-10', uiSquircleSm, uiSkeletonBlock)} />
          </div>
          <Skeleton className={cn('h-3 w-40 rounded', uiSkeletonBlock)} />
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className={cn('h-11 flex-1', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-11 w-full lg:w-52', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-11 w-full lg:w-40', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-11 w-full lg:w-32', uiSquircleSm, uiSkeletonBlock)} />
        </div>
      </div>

      <CommonMobileCardGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <PayrollCardSkeleton key={index} />
        ))}
      </CommonMobileCardGrid>

      <PayrollTableSkeleton />
    </div>
  )
}

export function PayrollSkeleton({
  variant = 'admin',
  showHeader = true,
  className,
}: PayrollSkeletonProps) {
  if (variant === 'employee') {
    return <div className={className}>{EmployeePayrollSkeleton()}</div>
  }

  return (
    <div className={className}>
      <AdminPayrollSkeleton showHeader={showHeader} />
    </div>
  )
}
