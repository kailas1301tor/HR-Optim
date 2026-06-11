// components/settings/useServiceTypesAndStatuses.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { invalidateAssetDropdowns } from '@/components/assets/useAssetDropdowns'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { serviceTypeService, type ServiceType } from '@/services/service-type-service'
import { assetStatusService, type AssetStatus } from '@/services/asset-status-service'

export interface UseServiceTypesAndStatusesReturn {
  serviceTypes: ServiceType[]
  serviceTypesLoading: boolean
  serviceTypesHasError: boolean
  assetStatuses: AssetStatus[]
  assetStatusesLoading: boolean
  assetStatusesHasError: boolean
  loadServiceTypes: () => Promise<void>
  loadAssetStatuses: () => Promise<void>
  handleServiceTypeSave: (id: number | null, name: string) => Promise<void>
  handleServiceTypeDelete: (id: number) => Promise<void>
  handleAssetStatusSave: (id: number | null, name: string) => Promise<void>
  handleAssetStatusDelete: (id: number) => Promise<void>
}

export function useServiceTypesAndStatuses(): UseServiceTypesAndStatusesReturn {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true)
  const [serviceTypesHasError, setServiceTypesHasError] = useState(false)
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([])
  const [assetStatusesLoading, setAssetStatusesLoading] = useState(true)
  const [assetStatusesHasError, setAssetStatusesHasError] = useState(false)
  const serviceTypesRequestIdRef = useRef(0)
  const statusesRequestIdRef = useRef(0)

  const loadServiceTypes = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setServiceTypesLoading,
      setHasError: setServiceTypesHasError,
      fetcher: () => serviceTypeService.getServiceTypes(),
      onSuccess: setServiceTypes,
      errorMessage: 'Failed to load service types',
      requestIdRef: serviceTypesRequestIdRef,
    })
  }, [])

  const loadAssetStatuses = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setAssetStatusesLoading,
      setHasError: setAssetStatusesHasError,
      fetcher: () => assetStatusService.getAssetStatuses(),
      onSuccess: setAssetStatuses,
      errorMessage: 'Failed to load asset statuses',
      requestIdRef: statusesRequestIdRef,
    })
  }, [])

  useEffect(() => {
    loadServiceTypes()
    loadAssetStatuses()
  }, [loadServiceTypes, loadAssetStatuses])

  const handleServiceTypeSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await serviceTypeService.updateServiceType(id, name)
      } else {
        await serviceTypeService.createServiceType(name)
      }
      invalidateAssetDropdowns()
      await loadServiceTypes()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save service type')
    }
  }

  const handleServiceTypeDelete = async (id: number): Promise<void> => {
    try {
      await serviceTypeService.deleteServiceType(id)
      invalidateAssetDropdowns()
      await loadServiceTypes()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete service type')
    }
  }

  const handleAssetStatusSave = async (id: number | null, name: string): Promise<void> => {
    try {
      if (id !== null) {
        await assetStatusService.updateAssetStatus(id, name)
      } else {
        await assetStatusService.createAssetStatus(name)
      }
      invalidateAssetDropdowns()
      await loadAssetStatuses()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save status label')
    }
  }

  const handleAssetStatusDelete = async (id: number): Promise<void> => {
    try {
      await assetStatusService.deleteAssetStatus(id)
      invalidateAssetDropdowns()
      await loadAssetStatuses()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete status label')
    }
  }

  return {
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
  }
}
