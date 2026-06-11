// components/assets/asset-card.tsx
'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, MapPin, MoreHorizontal, Eye, Pencil, Trash2, UserCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { uiCardInteractive } from '@/lib/ui/design-system'
import type { BackendAsset } from '@/types/asset'
import { isAssetDisposed, isAssetInService, formatAssetCost } from '@/lib/helpers/asset-status'
import { getAssetTypeConfig, getAssetStatusBadgeVariant } from './assets-constants'

interface AssetCardProps {
  asset: BackendAsset
  index: number
  onEdit: (asset: BackendAsset) => void
  onDelete: (id: number) => void
}

export function AssetCard({ asset, index, onEdit, onDelete }: AssetCardProps) {
  const router = useRouter()
  const category = getAssetTypeConfig(asset.asset_type)
  const CategoryIcon = category.icon
  const statusVariant = getAssetStatusBadgeVariant(asset.status)

  const statusLower = asset.status?.toLowerCase() || ''
  const isDisposed = isAssetDisposed(asset.status)
  const isAssigned = isAssetInService(asset.status)
  const inRepair = statusLower.includes('repair') || statusLower.includes('maintenance')

  const handleCardClick = () => {
    router.push(`/assets/${asset.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(uiCardInteractive, 'p-5 group cursor-pointer')}
      aria-label={`View asset ${asset.name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('w-10 h-10 rounded-[20px] [corner-shape:squircle] flex items-center justify-center shrink-0', category.color)}>
            <CategoryIcon className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cloud truncate group-hover:text-violet-glow transition-colors">
              {asset.name}
            </p>
            <p className="text-xs font-mono text-violet-glow">
              AST-{String(asset.id).padStart(3, '0')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <CommonStatusBadge variant={statusVariant} label={asset.status || 'Unknown'} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-midnight"
                aria-label="Asset actions"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border/80 text-xs rounded-[20px] [corner-shape:squircle]">
              <DropdownMenuItem onClick={() => router.push(`/assets/${asset.id}`)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                View Details
              </DropdownMenuItem>
              {!isDisposed && (
                <>
                  <DropdownMenuSeparator className="border-border/40" />
                  {!isAssigned && !inRepair && (
                    <DropdownMenuItem onClick={() => router.push(`/assets/${asset.id}?tab=overview`)} className="cursor-pointer">
                      <UserCheck className="w-4 h-4 mr-2 text-slate-400" />
                      Assign Asset
                    </DropdownMenuItem>
                  )}
                  {isAssigned && (
                    <DropdownMenuItem onClick={() => router.push(`/assets/${asset.id}?tab=overview`)} className="cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-2 text-slate-400" />
                      Transfer Asset
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem onClick={() => onEdit(asset)} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2 text-slate-400" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-destructive focus:text-destructive cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" />
                Dispose
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground mb-4">
        <p className="text-slate-350">{asset.asset_type || 'Other'}</p>
        {asset.department ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2 py-0.5 rounded-full">
            <Building2 className="w-2.5 h-2.5" />
            {asset.department}
          </span>
        ) : null}
        {asset.location && (
          <p className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{asset.location}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[50%]">
          {asset.serial_number || '—'}
        </span>
        <span className="text-sm font-mono text-cloud tabular-nums font-medium">
          {formatAssetCost(asset.purchase_cost)}
        </span>
      </div>
    </motion.div>
  )
}
