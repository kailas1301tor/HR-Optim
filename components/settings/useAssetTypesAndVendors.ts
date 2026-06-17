// components/settings/useAssetTypesAndVendors.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { invalidateAssetDropdowns } from '@/components/assets/useAssetDropdowns'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { assetTypeService, type AssetType } from '@/services/asset-type-service'
import { vendorService } from '@/services/vendor-service'
import type { FrontendVendor } from '@/types/settings'

export interface UseAssetTypesAndVendorsReturn {
  assetTypes: AssetType[]
  assetTypesLoading: boolean
  assetTypesHasError: boolean
  vendors: FrontendVendor[]
  vendorsLoading: boolean
  vendorsHasError: boolean
  loadAssetTypes: () => Promise<void>
  loadVendors: () => Promise<void>
  handleAssetTypeSave: (id: number | null, name: string) => Promise<void>
  handleAssetTypeDelete: (id: number) => Promise<void>
}

export function useAssetTypesAndVendors(): UseAssetTypesAndVendorsReturn {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([])
  const [assetTypesLoading, setAssetTypesLoading] = useState(true)
  const [assetTypesHasError, setAssetTypesHasError] = useState(false)
  const [vendors, setVendors] = useState<FrontendVendor[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(true)
  const [vendorsHasError, setVendorsHasError] = useState(false)
  const typesRequestIdRef = useRef(0)
  const vendorsRequestIdRef = useRef(0)

  const loadAssetTypes = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setAssetTypesLoading,
      setHasError: setAssetTypesHasError,
      fetcher: () => assetTypeService.getAssetTypes(),
      onSuccess: setAssetTypes,
      errorMessage: 'Failed to load asset types',
      requestIdRef: typesRequestIdRef,
    })
  }, [])

  const loadVendors = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setVendorsLoading,
      setHasError: setVendorsHasError,
      fetcher: () => vendorService.getVendors(),
      onSuccess: setVendors,
      errorMessage: 'Failed to load vendors',
      requestIdRef: vendorsRequestIdRef,
    })
  }, [])

  useEffect(() => {
    loadAssetTypes()
    loadVendors()
  }, [loadAssetTypes, loadVendors])

  const handleAssetTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetTypeService.updateAssetType(id, name)
      } else {
        await assetTypeService.createAssetType(name)
      }
      invalidateAssetDropdowns()
      await loadAssetTypes()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save asset type')
    }
  }

  const handleAssetTypeDelete = async (id: number): Promise<void> => {
    try {
      await assetTypeService.deleteAssetType(id)
      invalidateAssetDropdowns()
      await loadAssetTypes()
      await loadVendors()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete asset type')
    }
  }

  return {
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
  }
}
