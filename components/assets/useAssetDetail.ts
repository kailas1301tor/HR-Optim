// components/assets/useAssetDetail.ts
'use client'

import { useEffect, useState, useTransition, useRef, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { assetService } from '@/services/asset-service'
import { isAssetDisposed } from '@/lib/helpers/asset-status'
import type { Asset, AssetDropdowns } from '@/types/asset'
import type { Department } from '@/types/settings'
import { getAssetTypeConfig, getStatusConfig } from './assets-constants'
import { useAssetDropdowns } from './useAssetDropdowns'

export interface UseAssetDetailReturn {
  asset: Asset | null
  dropdowns: AssetDropdowns | null
  isLoading: boolean
  error: string | null
  isAssignOpen: boolean
  isTransferOpen: boolean
  isMaintenanceOpen: boolean
  isReturnOpen: boolean
  isDisposeOpen: boolean
  activeTab: string
  isPending: boolean
  typeConfig: ReturnType<typeof getAssetTypeConfig> | null
  statusConfig: ReturnType<typeof getStatusConfig> | null
  isDisposed: boolean
  isAssigned: boolean
  inRepair: boolean
  setIsAssignOpen: (open: boolean) => void
  setIsTransferOpen: (open: boolean) => void
  setIsMaintenanceOpen: (open: boolean) => void
  setIsReturnOpen: (open: boolean) => void
  setIsDisposeOpen: (open: boolean) => void
  setIsEditOpen: (open: boolean) => void
  setTab: (tabName: string) => void
  fetchAssetDetails: () => void
  departments: Department[]
  isEditOpen: boolean
}

export function useAssetDetail(assetId: number): UseAssetDetailReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const { dropdowns, departments } = useAssetDropdowns()

  const [asset, setAsset] = useState<Asset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)
  const [isReturnOpen, setIsReturnOpen] = useState(false)
  const [isDisposeOpen, setIsDisposeOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const activeTab = searchParams.get('tab') || 'overview'

  const fetchAssetDetails = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    setAsset(null)
    setError(null)
    setIsAssignOpen(false)
    setIsTransferOpen(false)
    setIsMaintenanceOpen(false)
    setIsReturnOpen(false)
    setIsDisposeOpen(false)
    setIsEditOpen(false)
  }, [assetId])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadAsset(): Promise<void> {
      setIsLoading(true)
      setError(null)
      try {
        const assetData = await assetService.getAssetById(assetId, controller.signal)
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setAsset(assetData)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setAsset(null)
        setError(err instanceof Error ? err.message : 'Failed to load asset details')
        toast.error('Failed to fetch asset details')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadAsset()
    return () => controller.abort()
  }, [assetId, reloadToken])

  const setTab = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabName)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const typeConfig = asset ? getAssetTypeConfig(asset.asset_type) : null
  const statusConfig = asset ? getStatusConfig(asset.status) : null

  const statusLower = asset?.status?.toLowerCase() || ''
  const isDisposed = isAssetDisposed(asset?.status)
  const isAssigned =
    statusLower.includes('assign') || statusLower.includes('in use') || statusLower.includes('in-use')
  const inRepair = statusLower.includes('repair') || statusLower.includes('maintenance')

  return {
    asset,
    dropdowns,
    departments,
    isLoading,
    error,
    isAssignOpen,
    isTransferOpen,
    isMaintenanceOpen,
    isReturnOpen,
    isDisposeOpen,
    isEditOpen,
    activeTab,
    isPending,
    typeConfig,
    statusConfig,
    isDisposed,
    isAssigned,
    inRepair,
    setIsAssignOpen,
    setIsTransferOpen,
    setIsMaintenanceOpen,
    setIsReturnOpen,
    setIsDisposeOpen,
    setIsEditOpen,
    setTab,
    fetchAssetDetails,
  }
}
