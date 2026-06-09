// components/assets/assets-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommonEmptyState } from '@/components/common'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { AssetsPageHeader } from './assets-page-header'
import { AssetsStatsCards } from './assets-stats-cards'
import { AssetsToolbar } from './assets-toolbar'
import { AssetsTable } from './assets-table'
import { AssetCard } from './asset-card'
import { AssetCardSkeleton } from './asset-card-skeleton'
import { AddAssetModal } from './add-asset-modal'
import { useAssetsTable } from './useAssetsTable'

export function AssetsList() {
  const {
    assetsList,
    pagination,
    dropdowns,
    departments,
    isTableLoading,
    selectedAsset,
    isAddOpen,
    deleteTargetId,
    isDeleting,
    searchQuery,
    statusFilter,
    typeFilter,
    totalValue,
    inServiceCount,
    utilizationRate,
    setSelectedAsset,
    setIsAddOpen,
    setDeleteTargetId,
    fetchAssets,
    updateQueryParams,
    executeDelete,
  } = useAssetsTable()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        updateQueryParams({ search: localSearch, page: '1' })
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, searchQuery])

  const handleAddAsset = () => {
    setSelectedAsset(null)
    setIsAddOpen(true)
  }

  const handleExport = () => {
    toast.success('Exporting assets...')
  }

  const handleClearFilters = () => {
    setLocalSearch('')
    updateQueryParams({ search: '', status: 'all', asset_type: 'all', page: '1' })
  }

  const totalValueLabel = `AED ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  const showEmpty = !isTableLoading && assetsList.length === 0

  return (
    <div className="space-y-6">
      <AssetsPageHeader onAddAsset={handleAddAsset} />

      <AssetsStatsCards
        totalCount={pagination.totalCount}
        inServiceCount={inServiceCount}
        utilizationRate={utilizationRate}
        totalValue={totalValueLabel}
        isLoading={isTableLoading}
      />

      <AssetsToolbar
        localSearch={localSearch}
        onSearchChange={setLocalSearch}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        dropdowns={dropdowns}
        onStatusChange={(val) => updateQueryParams({ status: val, page: '1' })}
        onTypeChange={(val) => updateQueryParams({ asset_type: val, page: '1' })}
        onExport={handleExport}
        onAddAsset={handleAddAsset}
      />

      {isTableLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <AssetCardSkeleton key={idx} />
            ))}
          </div>
          <AssetsTable
            assetsList={[]}
            isTableLoading
            pagination={pagination}
            deleteTargetId={null}
            isDeleting={false}
            onEdit={() => {}}
            onDelete={() => {}}
            onPageChange={() => {}}
            onDeleteDialogChange={() => {}}
            onExecuteDelete={() => {}}
          />
        </>
      ) : showEmpty ? (
        <CommonEmptyState
          icon={Package}
          title="No assets found"
          description="Try updating your search query or filters, or add a new asset to get started."
          actions={
            <>
              <Button
                type="button"
                onClick={handleAddAsset}
                className="h-9 text-xs bg-violet-core hover:bg-violet-core/90 text-white rounded-xl"
              >
                Add Asset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className={cn(uiOutlineBtn, 'h-9 text-xs')}
              >
                Clear Filters
              </Button>
            </>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {assetsList.map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
                onEdit={(a) => {
                  setSelectedAsset(a)
                  setIsAddOpen(true)
                }}
                onDelete={(id) => setDeleteTargetId(id)}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 lg:hidden px-1">
              <p className="text-xs text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage <= 1 || isTableLoading}
                  onClick={() => updateQueryParams({ page: String(pagination.currentPage - 1) })}
                  className={cn(uiOutlineBtn, 'text-xs h-8')}
                >
                  Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.totalPages || isTableLoading}
                  onClick={() => updateQueryParams({ page: String(pagination.currentPage + 1) })}
                  className={cn(uiOutlineBtn, 'text-xs h-8')}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          <AssetsTable
            assetsList={assetsList}
            isTableLoading={isTableLoading}
            pagination={pagination}
            deleteTargetId={deleteTargetId}
            isDeleting={isDeleting}
            onEdit={(a) => {
              setSelectedAsset(a)
              setIsAddOpen(true)
            }}
            onDelete={(id) => setDeleteTargetId(id)}
            onPageChange={(page) => updateQueryParams({ page: String(page) })}
            onDeleteDialogChange={(open) => !open && setDeleteTargetId(null)}
            onExecuteDelete={executeDelete}
          />
        </>
      )}

      <AddAssetModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={fetchAssets}
        editAsset={selectedAsset}
        dropdowns={dropdowns}
        departments={departments}
      />
    </div>
  )
}
