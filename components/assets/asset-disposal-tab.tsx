// components/assets/asset-disposal-tab.tsx
'use client'

import { type AssetDropdowns } from '@/services/asset-service'
import { Trash2, Calendar, DollarSign, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useAssetDisposalTab } from './useAssetDisposalTab'

interface AssetDisposalTabProps {
  assetId: number
  dropdowns: AssetDropdowns | null
}

export function AssetDisposalTab({ assetId, dropdowns }: AssetDisposalTabProps) {
  const { disposal, isLoading, formatDate } = useAssetDisposalTab(assetId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Warning Banner Shimmer */}
        <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 flex items-start gap-4">
          <Skeleton className={cn('w-6 h-6 rounded-xl shrink-0', uiSkeletonBlock)} />
          <div className="space-y-2 w-full">
            <Skeleton className={cn('h-4 w-40 rounded-xl', uiSkeletonBlock)} />
            <Skeleton className={cn('h-3 w-3/4 rounded-xl', uiSkeletonBlock)} />
          </div>
        </div>

        {/* Details Card Shimmer */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-6">
          <Skeleton className={cn('h-4 w-44 rounded-xl', uiSkeletonBlock)} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-midnight/35 border border-border/40 p-5 rounded-xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className={cn('w-5 h-5 rounded-xl shrink-0', uiSkeletonBlock)} />
                <div className="space-y-1.5 w-full">
                  <Skeleton className={cn('h-2.5 w-16 rounded-xl', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-4 w-24 rounded-xl', uiSkeletonBlock)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!disposal) {
    return (
      <div className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-200">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-cloud">Asset in Active Inventory</h4>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
          This asset is active and in service. If you need to write it off, sell, recycle, or scrap it, choose **Dispose Asset** from the actions menu at the top of the page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Warning Decommission Banner */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-400">Asset Decommissioned</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            This asset has been officially disposed of and retired from the organization's active ledger. No further assignments, transfers, or repairs can be scheduled.
          </p>
        </div>
      </div>

      {/* Disposal Details card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" /> Disposal Record Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-midnight/35 border border-border/40 p-5 rounded-xl">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Disposal Date</span>
              <p className="text-sm font-semibold text-cloud mt-0.5">
                {formatDate(disposal.disposal_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Disposal Method</span>
              <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded inline-block mt-1">
                {disposal.disposal_method}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Recovery Value</span>
              <p className="text-sm font-bold font-mono text-cloud mt-0.5">
                AED {parseFloat(disposal.disposal_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
