// components/assets/asset-history-tab.tsx
'use client'

import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useAssetHistoryTab } from './useAssetHistoryTab'

interface AssetHistoryTabProps {
  assetId: number
}

export function AssetHistoryTab({ assetId }: AssetHistoryTabProps) {
  const { history, isLoading, hasError, handleRetry, getActionConfig } = useAssetHistoryTab(assetId)

  if (isLoading) {
    return (
      <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className={cn('h-5 w-48 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
        <div className="relative pl-6 border-l-2 border-border/40 ml-3 space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline marker */}
              <Skeleton className={cn('absolute -left-[37px] top-1.5 w-6 h-6 rounded-full', uiSkeletonBlock)} />
              {/* Card shimmer */}
              <div className="bg-midnight/35 border border-border/40 p-4 rounded-[20px] [corner-shape:squircle] space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Skeleton className={cn('h-4 w-32 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-24 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className={cn('h-3.5 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3.5 w-24 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                </div>
                <Skeleton className={cn('h-8 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load history"
        message="Asset lifecycle events could not be retrieved."
        onRetry={handleRetry}
        className="rounded-[32px] [corner-shape:squircle] border border-border bg-card"
      />
    )
  }

  if (history.length === 0) {
    return (
      <CommonEmptyState
        icon={History}
        title="No logs found"
        description="No lifecycle events have been logged for this asset yet."
        className="py-12 rounded-[32px] [corner-shape:squircle] border border-border bg-card shadow-none"
      />
    )
  }

  return (
    <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 relative overflow-hidden animate-in fade-in-50 duration-200">
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
            <div key={`history-${idx}-${entry.id}-${entry.date}-${entry.action}`} className="relative group animate-in slide-in-from-left-2 duration-200">
              {/* Timeline marker */}
              <div className={cn(
                'absolute -left-[37px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-xs transition-colors',
                config.color
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Log Details */}
              <div className="bg-midnight/35 border border-border/40 p-4 rounded-[20px] [corner-shape:squircle] space-y-1.5 transition-colors group-hover:border-border/80">
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
                  <div className="text-xs bg-midnight/35 p-2.5 rounded-[16px] [corner-shape:squircle] border border-border/30 text-slate-400 mt-2 italic">
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
