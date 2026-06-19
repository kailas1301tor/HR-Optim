// components/payroll/payroll-adjustments-table.tsx
'use client'

import { useState } from 'react'
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BackendPayrollAdjustment } from '@/types/payroll'

interface PayrollAdjustmentsTableProps {
  adjustments: BackendPayrollAdjustment[]
  canManage: boolean
  canFinalize: boolean
  isDeleting: boolean
  onDeleteAdjustment: (id: number) => Promise<void>
}

export function PayrollAdjustmentsTable({
  adjustments,
  canManage,
  canFinalize,
  isDeleting,
  onDeleteAdjustment,
}: PayrollAdjustmentsTableProps): React.JSX.Element {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    await onDeleteAdjustment(id)
    setConfirmDeleteId(null)
  }

  if (adjustments.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-border/60 rounded-[20px] [corner-shape:squircle] bg-midnight/10">
        <p className="text-xs text-muted-foreground">No adjustments generated or added for this period.</p>
      </div>
    )
  }

  return (
    <div className="border border-border/40 rounded-[20px] [corner-shape:squircle] overflow-hidden bg-card/20 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-midnight/40 text-slate-400 font-medium">
              <th className="p-3">Type</th>
              <th className="p-3">Rule/Name</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3">Reason</th>
              {canManage && canFinalize && <th className="p-3 w-20 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {adjustments.map((adj) => {
              const isAllowance = adj.adjustment_type?.toLowerCase() === 'allowance'
              return (
                <tr key={adj.id} className="hover:bg-midnight/20 transition-colors">
                  <td className="p-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[10px]',
                        isAllowance
                          ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      )}
                    >
                      {isAllowance ? (
                        <ArrowUpRight className="w-3 h-3 text-lime-400 shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-400 shrink-0" />
                      )}
                      {adj.adjustment_type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-300">
                    {adj.pay_rule || 'Custom'}
                  </td>
                  <td className="p-3 text-slate-300 max-w-[130px] truncate" title={adj.description ?? undefined}>
                    {adj.description || '—'}
                  </td>
                  <td className={cn('p-3 text-right font-mono font-semibold', isAllowance ? 'text-lime-400' : 'text-red-400')}>
                    {isAllowance ? '+' : '-'}₹{parseFloat(adj.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-slate-400 max-w-[150px] truncate" title={adj.reason ?? undefined}>
                    {adj.reason || '—'}
                  </td>
                  {canManage && canFinalize && (
                    <td className="p-3 text-center">
                      {confirmDeleteId === adj.id ? (
                        <div className="flex items-center gap-1.5 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => void handleDelete(adj.id)}
                            className="h-7 text-[10px] px-2 font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Yes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => setConfirmDeleteId(null)}
                            className="h-7 text-[10px] px-2 text-slate-400"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => setConfirmDeleteId(adj.id)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                          title="Delete adjustment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
