// components/assets/assets-list.tsx
'use client'

import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorBanner,
  CommonErrorState,
  CommonMobileCardGrid,
  CommonPagination,
} from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { AssetsPageHeader } from './assets-page-header'
import { AssetsStatsCards } from './assets-stats-cards'
import { AssetsToolbar } from './assets-toolbar'
import { AssetsTable } from './assets-table'
import { AssetCard } from './asset-card'
import { AssetCardSkeleton } from './asset-card-skeleton'
import { AddAssetModal } from './add-asset-modal'
import { DisposeAssetDialog } from './dispose-asset-dialog'
import { useAssetsTable } from './useAssetsTable'

export function AssetsList() {
  const {
    assetsList,
    pagination,
    dropdowns,
    departments,
    dropdownsError,
    reloadDropdowns,
    isTableLoading,
    hasError,
    selectedAsset,
    isAddOpen,
    disposeTargetId,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    pageStats,
    setSelectedAsset,
    setIsAddOpen,
    setDisposeTargetId,
    handleRetry,
    updateQueryParams,
    handleClearFilters,
  } = useAssetsTable()

  const handleAddAsset = () => {
    setSelectedAsset(null)
    setIsAddOpen(true)
  }

  const showEmpty = !isTableLoading && !hasError && assetsList.length === 0

  return (
    <div className="space-y-6">
      <AssetsPageHeader onAddAsset={handleAddAsset} />

      <AssetsStatsCards
        totalCount={pageStats.totalCount}
        inServiceCount={pageStats.inServiceCount}
        utilizationRate={pageStats.utilizationRate}
        totalValue={pageStats.totalValueLabel}
        isPageScoped={pageStats.isPageScoped}
        isLoading={isTableLoading}
      />

      {dropdownsError && (
        <CommonErrorBanner
          message="Filter options could not be loaded. Status and category filters may be unavailable."
          onRetry={() => void reloadDropdowns()}
        />
      )}

      <AssetsToolbar
        localSearch={localSearch}
        onSearchChange={setLocalSearch}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        dropdowns={dropdowns}
        onStatusChange={(val) => updateQueryParams({ status: val, page: '1' })}
        onTypeChange={(val) => updateQueryParams({ asset_type: val, page: '1' })}
        onAddAsset={handleAddAsset}
      />

      {hasError ? (
        <CommonErrorState
          title="Failed to load assets"
          message="Please check your connection and try again."
          onRetry={handleRetry}
        />
      ) : isTableLoading ? (
        <>
          <CommonMobileCardGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <AssetCardSkeleton key={idx} />
            ))}
          </CommonMobileCardGrid>
          <AssetsTable
            assetsList={[]}
            isTableLoading
            pagination={pagination}
            onEdit={() => {}}
            onDispose={() => {}}
            onPageChange={() => {}}
          />
        </>
      ) : showEmpty ? (
        <CommonEmptyState
          icon={Package}
          title="No assets found"
          description="Try updating your search query or filters, or add a new asset to get started."
          actions={
            <>
              <PrimaryButton onClick={handleAddAsset} className="text-xs min-h-11">
                Add Asset
              </PrimaryButton>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className={cn(uiOutlineBtn, 'text-xs min-h-11')}
              >
                Clear Filters
              </Button>
            </>
          }
        />
      ) : (
        <>
          <CommonMobileCardGrid>
            {assetsList.map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
                onEdit={(a) => {
                  setSelectedAsset(a)
                  setIsAddOpen(true)
                }}
                onDelete={(id) => setDisposeTargetId(id)}
              />
            ))}
          </CommonMobileCardGrid>

          {pagination.totalPages > 1 && (
            <CommonPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              onPageChange={(page) => updateQueryParams({ page: String(page) })}
              isLoading={isTableLoading}
              compact
              className="lg:hidden"
            />
          )}

          <AssetsTable
            assetsList={assetsList}
            isTableLoading={isTableLoading}
            pagination={pagination}
            onEdit={(a) => {
              setSelectedAsset(a)
              setIsAddOpen(true)
            }}
            onDispose={(id) => setDisposeTargetId(id)}
            onPageChange={(page) => updateQueryParams({ page: String(page) })}
          />
        </>
      )}

      <AddAssetModal
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open)
          if (!open) setSelectedAsset(null)
        }}
        onSuccess={handleRetry}
        editAsset={selectedAsset}
        dropdowns={dropdowns}
        departments={departments}
      />

      {disposeTargetId !== null && (
        <DisposeAssetDialog
          open={disposeTargetId !== null}
          onOpenChange={(open) => !open && setDisposeTargetId(null)}
          assetId={disposeTargetId}
          dropdowns={dropdowns}
          onSuccess={() => {
            setDisposeTargetId(null)
            handleRetry()
          }}
        />
      )}
    </div>
  )
}
