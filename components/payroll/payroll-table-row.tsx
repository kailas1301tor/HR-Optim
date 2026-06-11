// components/payroll/payroll-table-row.tsx
'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { PayrollRecord } from '@/types/payroll'
import { getPayrollStatusLabel } from '@/lib/mappers/payroll-mapper'
import { wpsStatusConfig } from './payroll-constants'

interface PayrollTableRowProps {
  record: PayrollRecord
  index: number
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onAddAdjustment: (record: PayrollRecord) => void
}

export function PayrollTableRow({
  record,
  index,
  isSelected,
  onToggleSelect,
  onAddAdjustment,
}: PayrollTableRowProps) {
  const wpsStatus = wpsStatusConfig[record.wpsStatus]
  const statusLabel = getPayrollStatusLabel(record.status)

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors"
    >
      <td className="px-4 py-3 w-12">
        {record.canFinalize ? (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(record.id)}
            aria-label={`Select ${record.employeeName} for finalization`}
          />
        ) : null}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {record.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-cloud">{record.employeeName}</p>
            <p className="text-xs text-muted-foreground">{record.employeeId}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-cloud tabular-nums font-medium">
          {record.baseSalary.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-slate-300 tabular-nums">
          +{record.allowances.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-lime-400 tabular-nums">
          +{record.overtime.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-red-400 tabular-nums">
          -{record.deductions.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-cloud font-semibold tabular-nums">
          {record.netSalary.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={cn('px-2 py-1 rounded-full text-[10px] font-medium', wpsStatus.className)}>
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onAddAdjustment(record)}
          aria-label={`Add adjustment for ${record.employeeName}`}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </td>
    </motion.tr>
  )
}
