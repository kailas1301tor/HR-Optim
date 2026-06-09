// components/assets/useAssetsTable.ts
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { assetService, type BackendAsset, type AssetDropdowns } from '@/services/asset-service'
import { departmentService, type Department } from '@/services/department-service'
import { INITIAL_ASSETS } from './assets-constants'

function countInService(assets: BackendAsset[]): number {
  return assets.filter((a) => {
    const s = a.status?.toLowerCase() || ''
    return s.includes('assigned') || s.includes('service') || s.includes('in use') || s.includes('in-use')
  }).length
}

export interface UseAssetsTableReturn {
  assetsList: BackendAsset[]
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  dropdowns: AssetDropdowns | null
  departments: Department[]
  isTableLoading: boolean
  selectedAsset: BackendAsset | null
  isAddOpen: boolean
  deleteTargetId: number | null
  isDeleting: boolean
  searchQuery: string
  statusFilter: string
  typeFilter: string
  pageParam: number
  totalValue: number
  inServiceCount: number
  utilizationRate: number
  setSelectedAsset: (asset: BackendAsset | null) => void
  setIsAddOpen: (open: boolean) => void
  setDeleteTargetId: (id: number | null) => void
  fetchAssets: () => Promise<void>
  updateQueryParams: (updates: Record<string, string | null>) => void
  executeDelete: () => Promise<void>
}

export function useAssetsTable(): UseAssetsTableReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [assetsList, setAssetsList] = useState<BackendAsset[]>([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })
  const [dropdowns, setDropdowns] = useState<AssetDropdowns | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [globalInService, setGlobalInService] = useState(0)

  const [selectedAsset, setSelectedAsset] = useState<BackendAsset | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const searchQuery = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const typeFilter = searchParams.get('asset_type') || 'all'
  const pageParam = Number(searchParams.get('page')) || 1

  const isFiltered = statusFilter !== 'all' || typeFilter !== 'all' || Boolean(searchQuery)

  const fetchAssets = async (signal?: AbortSignal) => {
    setIsTableLoading(true)
    try {
      const response = await assetService.getAssets(
        {
          page: pageParam,
          page_size: 10,
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          asset_type: typeFilter !== 'all' ? typeFilter : undefined,
        },
        INITIAL_ASSETS,
        signal
      )
      if (signal?.aborted) return
      setAssetsList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      toast.error('Failed to load assets list')
    } finally {
      if (!signal?.aborted) {
        setIsTableLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchAssets(controller.signal)
    return () => {
      controller.abort()
    }
  }, [searchQuery, statusFilter, typeFilter, pageParam])

  useEffect(() => {
    const controller = new AbortController()
    async function loadGlobalStats() {
      if (isFiltered || pagination.totalCount === 0) return
      try {
        const response = await assetService.getAssets(
          {
            page: 1,
            page_size: Math.min(pagination.totalCount, 500),
          },
          INITIAL_ASSETS,
          controller.signal
        )
        if (controller.signal.aborted) return
        setGlobalInService(countInService(response.data))
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }
    loadGlobalStats()
    return () => {
      controller.abort()
    }
  }, [pagination.totalCount, isFiltered])

  useEffect(() => {
    const controller = new AbortController()
    async function loadMetadata() {
      try {
        const [dropData, deptData] = await Promise.all([
          assetService.getAssetDropdowns(controller.signal),
          departmentService.getDepartments(),
        ])
        setDropdowns(dropData)
        setDepartments(deptData)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('Failed to fetch assets metadata filters:', err)
      }
    }
    loadMetadata()
    return () => {
      controller.abort()
    }
  }, [])

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    })
    router.push(`${pathname}?${nextParams.toString()}`)
  }

  const executeDelete = async () => {
    if (deleteTargetId === null) return
    setIsDeleting(true)
    try {
      await assetService.deleteAsset(deleteTargetId)
      toast.success('Asset disposed successfully')
      setDeleteTargetId(null)
      fetchAssets()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to dispose asset'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const totalValue = assetsList.reduce((sum, a) => sum + (a.purchase_cost ? parseFloat(a.purchase_cost) : 0), 0)
  const inServiceCount = isFiltered ? countInService(assetsList) : globalInService
  const utilizationDenominator = isFiltered ? Math.max(assetsList.length, 1) : Math.max(pagination.totalCount, 1)
  const utilizationRate = Math.round((inServiceCount / utilizationDenominator) * 100)

  return {
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
    pageParam,
    totalValue,
    inServiceCount,
    utilizationRate,
    setSelectedAsset,
    setIsAddOpen,
    setDeleteTargetId,
    fetchAssets,
    updateQueryParams,
    executeDelete,
  }
}
