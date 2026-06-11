// components/assets/assets-table-row.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Eye, Pencil, Trash2, MoreHorizontal, UserCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { getAssetStatusBadgeVariant } from './assets-constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BackendAsset } from '@/types/asset'
import { isAssetDisposed, isAssetInRepair, isAssetInService } from '@/lib/helpers/asset-status'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'
import { AssetAssignmentCell } from './asset-assignment-cell'

interface AssetsTableRowProps {
  asset: BackendAsset
  onEdit: (asset: BackendAsset) => void
  onDelete: (id: number) => void
  onAssign: (asset: BackendAsset) => void
  canManage?: boolean
}

export function AssetsTableRow({
  asset,
  onEdit,
  onDelete,
  onAssign,
  canManage = false,
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

  const isDisposed = isAssetDisposed(asset.status)
  const isAssigned = isAssetInService(asset.status)
  const inRepair = isAssetInRepair(asset.status)
  const canAssign = !isDisposed && !inRepair && !isAssigned
  const canShowAssignInMenu = !isDisposed && !inRepair

  return (
    <tr
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors cursor-pointer"
      onClick={() => router.push(`/assets/${asset.id}`)}
    >
      <td className="px-4 py-3 align-middle min-w-[200px] max-w-[280px]">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('w-10 h-10 shrink-0 rounded-[16px] [corner-shape:squircle] flex items-center justify-center', category.color)}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cloud truncate">{asset.name}</p>
            <p className="text-xs font-mono text-violet-glow truncate">
              AST-{String(asset.id).padStart(3, '0')}
            </p>
            {asset.serial_number && (
              <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">{asset.serial_number}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 align-middle whitespace-nowrap">
        <span className="text-sm text-slate-350">{asset.asset_type || 'Other'}</span>
      </td>
      <td className="px-4 py-3 align-middle min-w-[140px]">
        <AssetAssignmentCell asset={asset} />
      </td>
      <td className="px-4 py-3 align-middle whitespace-nowrap">
        <CommonStatusBadge variant={getAssetStatusBadgeVariant(asset.status)} label={status.label} />
      </td>
      <td className="px-4 py-3 align-middle text-right whitespace-nowrap">
        <span className="text-sm font-mono text-cloud tabular-nums font-medium">
          {formatCost(asset.purchase_cost)}
        </span>
      </td>
      <td className="px-4 py-3 align-middle text-right min-w-[100px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          {canManage && canAssign && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(uiOutlineBtn, 'h-8 px-2.5 text-xs gap-1')}
              onClick={() => onAssign(asset)}
              aria-label={`Assign ${asset.name}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Assign
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" aria-label="Asset actions">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border/80 text-cloud">
              <DropdownMenuItem onClick={() => router.push(`/assets/${asset.id}`)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                View Details
              </DropdownMenuItem>

              {canManage && !isDisposed && (
                <>
                  <DropdownMenuSeparator className="border-border/40" />
                  {canShowAssignInMenu && (
                    <DropdownMenuItem onClick={() => onAssign(asset)} className="cursor-pointer">
                      <UserCheck className="w-4 h-4 mr-2 text-slate-400" />
                      Assign Asset
                    </DropdownMenuItem>
                  )}
                  {isAssigned && (
                    <DropdownMenuItem onClick={() => router.push(`/assets/${asset.id}`)} className="cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-2 text-slate-400" />
                      Transfer Asset
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {canManage && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
