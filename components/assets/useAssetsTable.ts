// components/assets/useAssetsTable.ts
'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { downloadBlob } from '@/lib/helpers/download-blob'
import { assetService } from '@/services/asset-service'
import { computePageAssetStats } from '@/lib/mappers/asset-mapper'
import type { Asset, PageAssetStats } from '@/types/asset'
import { useAssetsFilters } from './useAssetsFilters'
import { useAssetDropdowns } from './useAssetDropdowns'

export interface UseAssetsTableReturn {
  assetsList: Asset[]
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  dropdowns: ReturnType<typeof useAssetDropdowns>['dropdowns']
  departments: ReturnType<typeof useAssetDropdowns>['departments']
  dropdownsError: boolean
  reloadDropdowns: () => Promise<void>
  isTableLoading: boolean
  hasError: boolean
  selectedAsset: Asset | null
  isAddOpen: boolean
  disposeTargetId: number | null
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  statusFilter: string
  typeFilter: string
  pageStats: PageAssetStats
  setSelectedAsset: (asset: Asset | null) => void
  setIsAddOpen: (open: boolean) => void
  setDisposeTargetId: (id: number | null) => void
  fetchAssets: (signal?: AbortSignal) => Promise<void>
  handleRetry: () => void
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleClearFilters: () => void
  isExporting: boolean
  handleExport: () => Promise<void>
}

export function useAssetsTable(): UseAssetsTableReturn {
  const {
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    isFiltered,
    listParams,
    updateQueryParams,
    handleClearFilters,
  } = useAssetsFilters()

  const {
    dropdowns,
    departments,
    hasError: dropdownsError,
    reload: reloadDropdowns,
  } = useAssetDropdowns()

  const [assetsList, setAssetsList] = useState<Asset[]>([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const fetchIdRef = useRef(0)

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [disposeTargetId, setDisposeTargetId] = useState<number | null>(null)

  const refreshList = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  const handleRetry = useCallback(() => {
    void reloadDropdowns()
    refreshList()
  }, [reloadDropdowns, refreshList])

  const fetchAssets = async (signal?: AbortSignal) => {
    const fetchId = ++fetchIdRef.current
    setIsTableLoading(true)
    setHasError(false)
    try {
      const response = await assetService.getAssets(listParams, signal)
      if (signal?.aborted || fetchId !== fetchIdRef.current) return
      setAssetsList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      if (fetchId !== fetchIdRef.current) return
      setHasError(true)
      setAssetsList([])
      toast.error('Failed to load assets list')
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsTableLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchAssets(controller.signal)
    return () => controller.abort()
  }, [listParams, reloadToken])

  const pageStats = useMemo(
    () =>
      computePageAssetStats(
        assetsList,
        pagination.totalCount,
        pagination.totalPages,
        isFiltered
      ),
    [assetsList, pagination.totalCount, pagination.totalPages, isFiltered]
  )

  const handleExport = async (): Promise<void> => {
    setIsExporting(true)
    try {
      const params: Record<string, string | number> = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter !== 'all') params.status = statusFilter
      if (typeFilter !== 'all') params.asset_type = typeFilter
      const { blob, filename } = await assetService.exportExcel(params)
      downloadBlob(blob, filename)
      toast.success('Assets exported successfully')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export assets'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  return {
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
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    pageStats,
    setSelectedAsset,
    setIsAddOpen,
    setDisposeTargetId,
    fetchAssets,
    handleRetry,
    updateQueryParams,
    handleClearFilters,
    isExporting,
    handleExport,
  }
}
