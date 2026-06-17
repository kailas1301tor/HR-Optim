// components/settings/useAssetCategoriesAndShops.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { invalidateAssetDropdowns } from '@/components/assets/useAssetDropdowns'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { assetCategoryService, type AssetCategory } from '@/services/asset-category-service'
import { maintenanceShopService, type MaintenanceShop } from '@/services/maintenance-shop-service'

export interface UseAssetCategoriesAndShopsReturn {
  assetCategories: AssetCategory[]
  assetCategoriesLoading: boolean
  assetCategoriesHasError: boolean
  maintenanceShops: MaintenanceShop[]
  maintenanceShopsLoading: boolean
  maintenanceShopsHasError: boolean
  loadAssetCategories: () => Promise<void>
  loadMaintenanceShops: () => Promise<void>
  handleAssetCategorySave: (id: number | null, name: string) => Promise<void>
  handleAssetCategoryDelete: (id: number) => Promise<void>
  handleMaintenanceShopSave: (id: number | null, name: string) => Promise<void>
  handleMaintenanceShopDelete: (id: number) => Promise<void>
}

export function useAssetCategoriesAndShops(): UseAssetCategoriesAndShopsReturn {
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([])
  const [assetCategoriesLoading, setAssetCategoriesLoading] = useState(true)
  const [assetCategoriesHasError, setAssetCategoriesHasError] = useState(false)
  const [maintenanceShops, setMaintenanceShops] = useState<MaintenanceShop[]>([])
  const [maintenanceShopsLoading, setMaintenanceShopsLoading] = useState(true)
  const [maintenanceShopsHasError, setMaintenanceShopsHasError] = useState(false)
  const categoriesRequestIdRef = useRef(0)
  const shopsRequestIdRef = useRef(0)

  const loadAssetCategories = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setAssetCategoriesLoading,
      setHasError: setAssetCategoriesHasError,
      fetcher: () => assetCategoryService.getAssetCategories(),
      onSuccess: setAssetCategories,
      errorMessage: 'Failed to load asset categories',
      requestIdRef: categoriesRequestIdRef,
    })
  }, [])

  const loadMaintenanceShops = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setMaintenanceShopsLoading,
      setHasError: setMaintenanceShopsHasError,
      fetcher: () => maintenanceShopService.getMaintenanceShops(),
      onSuccess: setMaintenanceShops,
      errorMessage: 'Failed to load maintenance shops',
      requestIdRef: shopsRequestIdRef,
    })
  }, [])

  useEffect(() => {
    loadAssetCategories()
    loadMaintenanceShops()
  }, [loadAssetCategories, loadMaintenanceShops])

  const handleAssetCategorySave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetCategoryService.updateAssetCategory(id, name)
      } else {
        await assetCategoryService.createAssetCategory(name)
      }
      invalidateAssetDropdowns()
      await loadAssetCategories()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save asset category')
    }
  }

  const handleAssetCategoryDelete = async (id: number): Promise<void> => {
    try {
      await assetCategoryService.deleteAssetCategory(id)
      invalidateAssetDropdowns()
      await loadAssetCategories()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete asset category')
    }
  }

  const handleMaintenanceShopSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await maintenanceShopService.updateMaintenanceShop(id, name)
      } else {
        await maintenanceShopService.createMaintenanceShop(name)
      }
      invalidateAssetDropdowns()
      await loadMaintenanceShops()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save maintenance shop')
    }
  }

  const handleMaintenanceShopDelete = async (id: number): Promise<void> => {
    try {
      await maintenanceShopService.deleteMaintenanceShop(id)
      invalidateAssetDropdowns()
      await loadMaintenanceShops()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete maintenance shop')
    }
  }

  return {
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
  }
}
