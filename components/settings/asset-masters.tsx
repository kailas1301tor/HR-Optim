// components/settings/asset-masters.tsx
'use client'

import { GenericMasterCard } from './hr-masters/generic-master-card'
import { VendorsMaster } from './vendors-master'
import { useAssetTypesAndVendors } from './useAssetTypesAndVendors'
import { useAssetCategoriesAndShops } from './useAssetCategoriesAndShops'
import { useServiceTypesAndStatuses } from './useServiceTypesAndStatuses'
import { useAssetDocumentTypes } from './useAssetDocumentTypes'
import { uiSectionHeader } from '@/lib/ui/design-system'

export function AssetMasters() {
  const {
    assetTypes,
    assetTypesLoading,
    assetTypesHasError,
    vendors,
    vendorsLoading,
    vendorsHasError,
    loadAssetTypes,
    loadVendors,
    handleAssetTypeSave,
    handleAssetTypeDelete,
  } = useAssetTypesAndVendors()

  const {
    assetCategories,
    assetCategoriesLoading,
    assetCategoriesHasError,
    maintenanceShops,
    maintenanceShopsLoading,
    maintenanceShopsHasError,
    loadAssetCategories,
    loadMaintenanceShops,
    handleAssetCategorySave,
    handleAssetCategoryDelete,
    handleMaintenanceShopSave,
    handleMaintenanceShopDelete,
  } = useAssetCategoriesAndShops()

  const {
    serviceTypes,
    serviceTypesLoading,
    serviceTypesHasError,
    assetStatuses,
    assetStatusesLoading,
    assetStatusesHasError,
    loadServiceTypes,
    loadAssetStatuses,
    handleServiceTypeSave,
    handleServiceTypeDelete,
    handleAssetStatusSave,
    handleAssetStatusDelete,
  } = useServiceTypesAndStatuses()

  const {
    items: assetDocumentTypes,
    isLoading: assetDocumentTypesLoading,
    hasError: assetDocumentTypesHasError,
    reload: loadAssetDocumentTypes,
    handleSave: handleAssetDocumentTypeSave,
    handleDelete: handleAssetDocumentTypeDelete,
  } = useAssetDocumentTypes()

  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <h2 className="text-lg font-semibold text-cloud">Asset Management Masters</h2>
        <p className="text-xs text-slate-400 mt-1">Define asset types, categories, and maintenance providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenericMasterCard
          title="Asset Types"
          items={assetTypes}
          isLoading={assetTypesLoading}
          hasError={assetTypesHasError}
          onRetry={loadAssetTypes}
          onSave={handleAssetTypeSave}
          onDelete={handleAssetTypeDelete}
          placeholder="e.g. LAPTOP"
          label="Asset Type"
        />

        <GenericMasterCard
          title="Asset Categories"
          items={assetCategories}
          isLoading={assetCategoriesLoading}
          hasError={assetCategoriesHasError}
          onRetry={loadAssetCategories}
          onSave={handleAssetCategorySave}
          onDelete={handleAssetCategoryDelete}
          placeholder="e.g. IT EQUIPMENT"
          label="Asset Category"
        />

        <GenericMasterCard
          title="Maintenance Shops"
          items={maintenanceShops}
          isLoading={maintenanceShopsLoading}
          hasError={maintenanceShopsHasError}
          onRetry={loadMaintenanceShops}
          onSave={handleMaintenanceShopSave}
          onDelete={handleMaintenanceShopDelete}
          placeholder="e.g. LAPTOP REPAIR"
          label="Maintenance Shop"
        />

        <VendorsMaster
          vendors={vendors}
          assetTypes={assetTypes}
          isLoading={vendorsLoading}
          hasError={vendorsHasError}
          onRefresh={loadVendors}
        />

        <GenericMasterCard
          title="Service Types"
          items={serviceTypes}
          isLoading={serviceTypesLoading}
          hasError={serviceTypesHasError}
          onRetry={loadServiceTypes}
          onSave={handleServiceTypeSave}
          onDelete={handleServiceTypeDelete}
          placeholder="e.g. REPAIR"
          label="Service Type"
        />

        <GenericMasterCard
          title="Status Labels"
          items={assetStatuses}
          isLoading={assetStatusesLoading}
          hasError={assetStatusesHasError}
          onRetry={loadAssetStatuses}
          onSave={handleAssetStatusSave}
          onDelete={handleAssetStatusDelete}
          placeholder="e.g. AVAILABLE"
          label="Status Label"
        />

        <GenericMasterCard
          title="Asset Document Types"
          items={assetDocumentTypes}
          isLoading={assetDocumentTypesLoading}
          hasError={assetDocumentTypesHasError}
          onRetry={loadAssetDocumentTypes}
          onSave={handleAssetDocumentTypeSave}
          onDelete={handleAssetDocumentTypeDelete}
          placeholder="e.g. Warranty Certificate"
          label="Document Type"
        />
      </div>
    </div>
  )
}
