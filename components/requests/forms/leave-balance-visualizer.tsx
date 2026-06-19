// components/requests/forms/leave-balance-visualizer.tsx
'use client'

import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { LeaveType } from '@/services/leave-type-service'
import type { LeaveBalanceRecord } from '@/types/request'
import { formatLeaveBalance } from '@/lib/helpers/leave-balance'

interface LeaveBalanceVisualizerProps {
  selectedLeaveType: (LeaveType & { is_document_required?: boolean }) | null
  leaveBalances: LeaveBalanceRecord[]
  isBalancesLoading: boolean
  hasBalancesError: boolean
  selectedBalance: number | null
  hasInsufficientBalance: boolean
  exceedsBalance: boolean
}

export function LeaveBalanceVisualizer({
  selectedLeaveType,
  isBalancesLoading,
  hasBalancesError,
  selectedBalance,
  hasInsufficientBalance,
  exceedsBalance,
}: LeaveBalanceVisualizerProps): React.JSX.Element {
  if (!selectedLeaveType) return <></>

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-[20px] [corner-shape:squircle] border px-4 py-3',
        isBalancesLoading && 'border-violet-core/30 bg-violet-core/10',
        hasBalancesError && 'border-red-500/30 bg-red-500/10',
        !isBalancesLoading &&
          !hasBalancesError &&
          hasInsufficientBalance &&
          'border-amber-500/30 bg-amber-500/10',
        !isBalancesLoading &&
          !hasBalancesError &&
          exceedsBalance &&
          'border-amber-500/30 bg-amber-500/10',
        !isBalancesLoading &&
          !hasBalancesError &&
          !hasInsufficientBalance &&
          !exceedsBalance &&
          selectedBalance !== null &&
          'border-border/50 bg-muted/40'
      )}
    >
      <div className="min-w-0 flex-1">
        <Label className="text-xs text-muted-foreground">Available Balance</Label>
        {isBalancesLoading && (
          <p className="text-[11px] font-medium mt-0.5 text-muted-foreground">
            Loading balance...
          </p>
        )}
        {hasBalancesError && (
          <p className="text-[11px] font-medium mt-0.5 text-red-600 dark:text-red-400">
            Could not load leave balance
          </p>
        )}
        {!isBalancesLoading && !hasBalancesError && selectedBalance === null && (
          <p className="text-[11px] font-medium mt-0.5 text-amber-600 dark:text-amber-300">
            No balance record found for this leave type
          </p>
        )}
        {!isBalancesLoading && !hasBalancesError && hasInsufficientBalance && (
          <p className="text-[11px] font-medium mt-0.5 text-amber-600 dark:text-amber-300">
            No leave balance available for this type
          </p>
        )}
        {!isBalancesLoading && !hasBalancesError && exceedsBalance && (
          <p className="text-[11px] font-medium mt-0.5 text-amber-600 dark:text-amber-300">
            Requested days exceed available balance
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isBalancesLoading ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading balance" />
        ) : (
          <span
            className={cn(
              'tabular-nums font-bold',
              selectedBalance !== null && selectedBalance > 0
                ? 'text-2xl text-foreground'
                : 'text-lg text-muted-foreground'
            )}
          >
            {selectedBalance !== null ? formatLeaveBalance(selectedBalance) : '—'}
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {selectedBalance === 1 ? 'day' : 'days'}
        </span>
      </div>
    </div>
  )
}
