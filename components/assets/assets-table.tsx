// components/assets/assets-table.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiOutlineBtn, uiSkeletonBlock, uiTableShell } from '@/lib/ui/design-system'
import { AssetsTableRow } from './assets-table-row'
import type { BackendAsset } from '@/types/asset'

const TABLE_COLUMNS = [
  { id: 'asset', label: 'Asset' },
  { id: 'type', label: 'Type' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'status', label: 'Status' },
  { id: 'cost', label: 'Cost', align: 'right' as const },
  { id: 'actions', label: 'Actions', align: 'right' as const },
] as const

interface AssetsTableProps {
  assetsList: BackendAsset[]
  isTableLoading: boolean
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  onEdit: (asset: BackendAsset) => void
  onDispose: (id: number) => void
  onAssign: (asset: BackendAsset) => void
  onPageChange: (page: number) => void
  canManage?: boolean
}

export function AssetsTable({
  assetsList,
  isTableLoading,
  pagination,
  onEdit,
  onDispose,
  onAssign,
  onPageChange,
  canManage = false,
}: AssetsTableProps) {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-midnight/40">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    'px-4 py-3 text-left',
                    'align' in col && col.align === 'right' && 'text-right'
                  )}
                >
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isTableLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-border/40">
                  <td className="px-4 py-3">
                    <Skeleton className={cn('h-10 w-full max-w-[220px] rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                  </td>
                  {Array.from({ length: TABLE_COLUMNS.length - 1 }).map((_, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3">
                      <Skeleton className={cn('h-4 w-20 rounded', uiSkeletonBlock)} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              assetsList.map((asset) => (
                <AssetsTableRow
                  key={asset.id}
                  asset={asset}
                  onEdit={onEdit}
                  onDelete={onDispose}
                  onAssign={onAssign}
                  canManage={canManage}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1 || isTableLoading}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className={cn(uiOutlineBtn, 'text-xs h-9')}
            >
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages || isTableLoading}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className={cn(uiOutlineBtn, 'text-xs h-9')}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
