// components/payroll/payroll-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { uiCard } from '@/lib/ui/design-system'
import type { PayrollRecord } from '@/types/payroll'
import { getPayrollStatusLabel } from '@/lib/mappers/payroll-mapper'
import { wpsStatusConfig } from './payroll-constants'

interface PayrollCardProps {
  record: PayrollRecord
  index: number
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onAddAdjustment: (record: PayrollRecord) => void
  canManage?: boolean
}

function formatAmount(value: number): string {
  return value.toLocaleString()
}

export function PayrollCard({
  record,
  index,
  isSelected,
  onToggleSelect,
  onAddAdjustment,
  canManage = false,
}: PayrollCardProps) {
  const wpsStatus = wpsStatusConfig[record.wpsStatus]
  const statusLabel = getPayrollStatusLabel(record.status)
  const showCheckbox = canManage && record.canFinalize

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className={cn(uiCard, 'p-5')}
      aria-label={`${record.employeeName} payroll — ${statusLabel}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {showCheckbox ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(record.id)}
              aria-label={`Select ${record.employeeName} for finalization`}
              className="shrink-0"
            />
          ) : null}
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {record.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cloud truncate">{record.employeeName}</p>
            <p className="text-xs text-muted-foreground truncate">{record.employeeId}</p>
          </div>
        </div>
        <span className={cn('px-2 py-1 rounded-full text-[10px] font-medium shrink-0', wpsStatus.className)}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground mb-1">Base Salary</p>
          <p className="font-mono text-cloud tabular-nums font-medium">{formatAmount(record.baseSalary)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Allowances</p>
          <p className="font-mono text-slate-300 tabular-nums">+{formatAmount(record.allowances)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Overtime</p>
          <p className="font-mono text-lime-400 tabular-nums">+{formatAmount(record.overtime)}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Deductions</p>
          <p className="font-mono text-red-400 tabular-nums">-{formatAmount(record.deductions)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/40">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Net Salary</p>
          <p className="text-base font-mono font-semibold text-cloud tabular-nums">
            {formatAmount(record.netSalary)}
          </p>
        </div>
        {canManage ? (
          <Button
            variant="outline"
            size="sm"
            className="h-10 min-h-10 gap-2 text-xs shrink-0"
            onClick={() => onAddAdjustment(record)}
            aria-label={`Add adjustment for ${record.employeeName}`}
          >
            <Eye className="w-4 h-4" />
            Adjust
          </Button>
        ) : null}
      </div>
    </motion.article>
  )
}
