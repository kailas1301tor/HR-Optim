// components/payroll/payroll-details-drawer.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiCard, uiOutlineBtn } from '@/lib/ui/design-system'
import type { PayrollRecord } from '@/types/payroll'
import { PayrollAdjustmentsTable } from './payroll-adjustments-table'

interface PayrollDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  canManage?: boolean
  isDeleting: boolean
  onDeleteAdjustment: (id: number) => Promise<void>
  onAddAdjustment: (record: PayrollRecord) => void
}

export function PayrollDetailsDrawer({
  open,
  onOpenChange,
  record,
  canManage = false,
  isDeleting,
  onDeleteAdjustment,
  onAddAdjustment,
}: PayrollDetailsDrawerProps): React.JSX.Element {
  if (!record) return <></>

  const adjustments = record.adjustments ?? []

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Sliding Right Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[800px] bg-carbon border-l border-border z-50 flex flex-col min-w-0 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-border/40 flex items-center justify-between shrink-0 bg-card/10">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-cloud">Payroll Details</h3>
                <p className="text-xs text-muted-foreground">Detailed calculation breakdown and adjustments logs</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-2.5 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider',
                    record.status.toLowerCase() === 'finalized'
                      ? 'bg-lime-500/15 text-lime-400 border border-lime-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  )}
                >
                  {record.status}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 text-slate-400 hover:text-cloud hover:bg-midnight/60 rounded-full"
                  aria-label="Close details panel"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Employee & Period Hero card */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-5 bg-midnight/30 rounded-[20px] border border-border/40">
                <div className="flex items-center gap-4.5">
                  <div className="w-13 h-13 rounded-[16px] [corner-shape:squircle] bg-gradient-to-br from-violet-core to-violet-glow text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    {record.initials}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-cloud flex items-center gap-1.5">
                      <User className="w-4 h-4 text-violet-glow" />
                      {record.employeeName}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {record.employeeId} • {record.department}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 sm:text-right">
                  <p className="flex items-center sm:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Pay Period
                  </p>
                  <p className="font-semibold text-cloud">
                    {record.startDate} to {record.endDate}
                  </p>
                </div>
              </div>

              {/* Financial Breakdown Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                <div className={cn(uiCard, 'p-4 bg-card/40')}>
                  <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5">Base Salary</p>
                  <p className="text-lg font-semibold text-cloud font-mono">₹{record.baseSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={cn(uiCard, 'p-4 bg-lime-500/[0.02] border-lime-500/10')}>
                  <p className="text-[10px] uppercase font-semibold text-lime-400 tracking-wider mb-1.5">Allowances</p>
                  <p className="text-lg font-semibold text-lime-400 font-mono">₹{record.allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={cn(uiCard, 'p-4 bg-teal-500/[0.02] border-teal-500/10')}>
                  <p className="text-[10px] uppercase font-semibold text-teal-400 tracking-wider mb-1.5">Overtime</p>
                  <p className="text-lg font-semibold text-teal-400 font-mono">₹{record.overtime.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={cn(uiCard, 'p-4 bg-red-500/[0.02] border-red-500/10')}>
                  <p className="text-[10px] uppercase font-semibold text-red-400 tracking-wider mb-1.5">Deductions</p>
                  <p className="text-lg font-semibold text-red-400 font-mono">₹{record.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={cn(uiCard, 'p-4 bg-card/40')}>
                  <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5">Gross Salary</p>
                  <p className="text-lg font-semibold text-cloud font-mono">₹{record.grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={cn(uiCard, 'p-4 bg-violet-core/[0.05] border-violet-core/25 shadow-violet-core/5 shadow-inner')}>
                  <p className="text-[10px] uppercase font-semibold text-violet-glow tracking-wider mb-1.5">Net Payout</p>
                  <p className="text-lg font-bold text-violet-glow font-mono">₹{record.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {/* Adjustments Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h4 className="text-sm font-semibold text-cloud flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-violet-glow" />
                    Adjustments Breakdown
                  </h4>
                  {canManage && record.canFinalize && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAddAdjustment(record)}
                      className="h-8 gap-1.5 text-xs bg-midnight border-border/60 hover:bg-midnight/90 text-cloud rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Adjustment
                    </Button>
                  )}
                </div>

                <PayrollAdjustmentsTable
                  adjustments={adjustments}
                  canManage={canManage}
                  canFinalize={record.canFinalize}
                  isDeleting={isDeleting}
                  onDeleteAdjustment={onDeleteAdjustment}
                />
              </div>
            </div>

            {/* Footer Panel */}
            <div className="p-4 sm:p-6 border-t border-border/40 bg-midnight/35 flex justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={cn(uiOutlineBtn, 'h-9 text-xs bg-transparent border-border/60 hover:bg-midnight/60 text-slate-300 hover:text-cloud rounded-lg')}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
