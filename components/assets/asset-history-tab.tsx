// components/assets/asset-history-tab.tsx
'use client'

import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useAssetHistoryTab } from './useAssetHistoryTab'

interface AssetHistoryTabProps {
  assetId: number
}

export function AssetHistoryTab({ assetId }: AssetHistoryTabProps) {
  const { history, isLoading, getActionConfig } = useAssetHistoryTab(assetId)

  if (isLoading) {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className={cn('h-5 w-48 rounded-xl', uiSkeletonBlock)} />
        </div>
        <div className="relative pl-6 border-l-2 border-border/40 ml-3 space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline marker */}
              <Skeleton className={cn('absolute -left-[37px] top-1.5 w-6 h-6 rounded-full', uiSkeletonBlock)} />
              {/* Card shimmer */}
              <div className="bg-midnight/35 border border-border/40 p-4 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Skeleton className={cn('h-4 w-32 rounded-xl', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-24 rounded-xl', uiSkeletonBlock)} />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className={cn('h-3.5 w-20 rounded-xl', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3.5 w-24 rounded-xl', uiSkeletonBlock)} />
                </div>
                <Skeleton className={cn('h-8 w-full rounded-xl', uiSkeletonBlock)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-border bg-card text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 border border-border/40 flex items-center justify-center text-slate-500 mb-2">
          <History className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-cloud">No logs found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-[280px]">No dynamic lifecycle events have been logged for this asset yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 relative overflow-hidden animate-in fade-in-50 duration-200">
      <h3 className="text-sm font-semibold text-cloud flex items-center gap-2 mb-6">
        <History className="w-4 h-4 text-violet-glow" /> Asset Lifecycle Timeline
      </h3>

      <div className="relative pl-6 border-l-2 border-border/60 ml-3 space-y-6">
        {history.map((entry, idx) => {
          const config = getActionConfig(entry.action)
          const Icon = config.icon
          const dateFormatted = new Date(entry.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })

          return (
            <div key={entry.id || idx} className="relative group animate-in slide-in-from-left-2 duration-200">
              {/* Timeline marker */}
              <div className={cn(
                'absolute -left-[37px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-xs transition-colors',
                config.color
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Log Details */}
              <div className="bg-midnight/35 border border-border/40 p-4 rounded-xl space-y-1.5 transition-colors group-hover:border-border/80">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <h4 className="text-sm font-bold text-cloud uppercase tracking-wide">
                    {entry.action}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {dateFormatted}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Performed by:</span>
                  <span className="font-medium text-cloud">{entry.performed_by || 'System Admin'}</span>
                </div>
                {entry.remarks && (
                  <div className="text-xs bg-midnight/35 p-2.5 rounded-lg border border-border/30 text-slate-400 mt-2 italic">
                    "{entry.remarks}"
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
