// components/requests/forms/leave-days-visualizer.tsx
'use client'

import { Loader2, RefreshCw } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { CommonFormFieldError } from '@/components/common'
import { cn } from '@/lib/utils'

interface LeaveDaysVisualizerProps {
  calculateState: 'idle' | 'loading' | 'success' | 'zero' | 'error' | 'invalid'
  calculateMessage: string | null
  numberOfDays: number
  fromDate: string
  toDate: string
  startSession: string
  endSession: string
  onRecalculate: () => void
  error?: string
}

export function LeaveDaysVisualizer({
  calculateState,
  calculateMessage,
  numberOfDays,
  fromDate,
  toDate,
  startSession,
  endSession,
  onRecalculate,
  error,
}: LeaveDaysVisualizerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-[20px] [corner-shape:squircle] border px-4 py-3',
        calculateState === 'success' && 'border-lime-400/30 bg-lime-400/10',
        calculateState === 'zero' && 'border-amber-500/30 bg-amber-500/10',
        calculateState === 'error' && 'border-red-500/30 bg-red-500/10',
        calculateState === 'invalid' && 'border-red-500/30 bg-red-500/10',
        calculateState === 'loading' && 'border-violet-core/30 bg-violet-core/10',
        calculateState === 'idle' && 'border-border/50 bg-muted/40'
      )}
    >
      <div className="min-w-0 flex-1">
        <Label className="text-xs text-muted-foreground">Working Days</Label>
        {calculateMessage && (
          <p
            className={cn(
              'text-[11px] font-medium mt-0.5 truncate',
              calculateState === 'zero' ? 'text-amber-600 dark:text-amber-300' : 'text-red-600 dark:text-red-400'
            )}
          >
            {calculateMessage}
          </p>
        )}
        {error && calculateState !== 'zero' && (
          <CommonFormFieldError message={error} />
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {calculateState === 'loading' ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Calculating" />
        ) : (
          <span
            className={cn(
              'tabular-nums font-bold',
              numberOfDays > 0 ? 'text-2xl text-foreground' : 'text-lg text-muted-foreground'
            )}
          >
            {numberOfDays > 0 ? numberOfDays : '—'}
          </span>
        )}
        {calculateState !== 'loading' && fromDate && toDate && startSession && endSession && (
          <button
            type="button"
            onClick={onRecalculate}
            className="flex items-center justify-center size-8 rounded-[16px] [corner-shape:squircle] border border-border/40 text-violet-glow hover:bg-violet-core/10 transition-colors"
            aria-label="Recalculate leave days"
          >
            <RefreshCw className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
