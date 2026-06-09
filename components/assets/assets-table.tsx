// components/assets/assets-table.tsx
'use client'

import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { uiCard, uiOutlineBtn, uiSkeletonBlock } from '@/lib/ui/design-system'
import { AssetsTableRow } from './assets-table-row'
import type { BackendAsset } from '@/services/asset-service'

interface AssetsTableProps {
  assetsList: BackendAsset[]
  isTableLoading: boolean
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  deleteTargetId: number | null
  isDeleting: boolean
  onEdit: (asset: BackendAsset) => void
  onDelete: (id: number) => void
  onPageChange: (page: number) => void
  onDeleteDialogChange: (open: boolean) => void
  onExecuteDelete: () => void
}

export function AssetsTable({
  assetsList,
  isTableLoading,
  pagination,
  deleteTargetId,
  isDeleting,
  onEdit,
  onDelete,
  onPageChange,
  onDeleteDialogChange,
  onExecuteDelete,
}: AssetsTableProps) {
  return (
    <>
      <div className={cn(uiCard, 'overflow-hidden hidden lg:block')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Asset', 'Type', 'Serial Number', 'Department / Location', 'Status', 'Cost (AED)'].map((col, idx) => (
                  <th
                    key={col}
                    className={cn(
                      'px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500',
                      idx === 5 ? 'text-right' : 'text-left'
                    )}
                  >
                    {col}
                  </th>
                ))}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className={cn('w-10 h-10 rounded-xl shrink-0', uiSkeletonBlock)} />
                        <div className="space-y-1.5">
                          <Skeleton className={cn('h-3 rounded w-28', uiSkeletonBlock)} />
                          <Skeleton className={cn('h-2 rounded w-16', uiSkeletonBlock)} />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className={cn('h-4 rounded w-20', uiSkeletonBlock, j === 4 ? 'ml-auto' : '')} />
                      </td>
                    ))}
                    <td className="px-4 py-3" />
                  </tr>
                ))
              ) : (
                <AnimatePresence>
                  {assetsList.map((asset, index) => (
                    <AssetsTableRow
                      key={asset.id}
                      asset={asset}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Page <span className="font-medium text-cloud">{pagination.currentPage}</span> of{' '}
              <span className="font-medium text-cloud">{pagination.totalPages}</span>
              {' · '}
              <span className="font-medium text-cloud">{pagination.totalCount}</span> assets
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
                Previous
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

      <AlertDialog open={deleteTargetId !== null} onOpenChange={onDeleteDialogChange}>
        <AlertDialogContent className="bg-card border border-border/80 rounded-2xl p-6 shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg">Dispose Asset</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm mt-2">
              Are you sure you want to dispose/delete this asset? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className={cn(uiOutlineBtn, 'text-xs')} disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={onExecuteDelete}
              className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-xl px-5 flex items-center gap-2 text-xs"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Disposing...' : 'Dispose'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
