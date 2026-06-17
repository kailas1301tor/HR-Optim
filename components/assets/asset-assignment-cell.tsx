'use client'

import { Building2, MapPin, User } from 'lucide-react'
import { getAssetAssignmentDisplay } from '@/lib/helpers/asset-assignment'
import { isAssetInService } from '@/lib/helpers/asset-status'
import type { Asset } from '@/types/asset'

interface AssetAssignmentCellProps {
  asset: Asset
  className?: string
}

export function AssetAssignmentCell({ asset, className }: AssetAssignmentCellProps) {
  const assignment = getAssetAssignmentDisplay(asset)
  const locationLine = [asset.location, asset.sub_location].filter(Boolean).join(' — ')

  return (
    <div className={className ?? 'space-y-1 min-w-0'}>
      {assignment && (
        <span
          className="text-xs text-cloud flex items-center gap-1 min-w-0"
          title={assignment.label}
        >
          {assignment.kind === 'employee' ? (
            <User className="w-3 h-3 text-violet-glow shrink-0" />
          ) : (
            <Building2 className="w-3 h-3 text-violet-glow shrink-0" />
          )}
          <span className="truncate font-medium">{assignment.label}</span>
        </span>
      )}
      {asset.department ? (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1 max-w-full">
          <Building2 className="w-2.5 h-2.5 shrink-0 text-violet-glow" />
          <span className="truncate">{asset.department}</span>
        </span>
      ) : !isAssetInService(asset.status) ? (
        <span className="text-xs text-muted-foreground">No department</span>
      ) : null}
      {locationLine && (
        <span className="text-xs text-slate-400 flex items-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{locationLine}</span>
        </span>
      )}
    </div>
  )
}
