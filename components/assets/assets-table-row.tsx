// components/assets/assets-table-row.tsx
'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2, MoreHorizontal, Building2, MapPin, UserCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { getAssetStatusBadgeVariant } from './assets-constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BackendAsset } from '@/services/asset-service'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'

interface AssetsTableRowProps {
  asset: BackendAsset
  index: number
  onEdit: (asset: BackendAsset) => void
  onDelete: (id: number) => void
}

export function AssetsTableRow({
  asset,
  index,
  onEdit,
  onDelete,
}: AssetsTableRowProps) {
  const router = useRouter()
  const category = getAssetTypeConfig(asset.asset_type)
  const status = getStatusConfig(asset.status)
  const CategoryIcon = category.icon

  const formatCost = (costStr: string | null) => {
    if (!costStr) return '0'
    const value = parseFloat(costStr)
    return isNaN(value) ? '0' : value.toLocaleString()
  }

  const statusLower = asset.status?.toLowerCase() || ''
  const isDisposed = statusLower.includes('dispose') || statusLower.includes('delete')
  const isAssigned = statusLower.includes('assign') || statusLower.includes('in use') || statusLower.includes('in-use')
  const inRepair = statusLower.includes('repair') || statusLower.includes('maintenance')

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors cursor-pointer"
      onClick={() => router.push(`/assets/${asset.id}`)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', category.color)}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-cloud">{asset.name}</p>
            <p className="text-xs font-mono text-violet-glow">
              AST-{String(asset.id).padStart(3, '0')}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-350">{asset.asset_type || 'Other'}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-mono text-slate-355">{asset.serial_number || '—'}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1 items-start">
          {asset.department ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Building2 className="w-2.5 h-2.5 text-violet-glow" />
              {asset.department}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Unassigned</span>
          )}
          {asset.location && (
            <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
              <MapPin className="w-3 h-3 text-slate-500" />
              {asset.location}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <CommonStatusBadge variant={getAssetStatusBadgeVariant(asset.status)} label={status.label} />
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-mono text-cloud tabular-nums font-medium">
          {formatCost(asset.purchase_cost)}
        </span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border/80 text-cloud">
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
      </td>
    </motion.tr>
  )
}
