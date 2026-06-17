// components/assets/useAssetsFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { AssetListParams } from '@/types/asset'

const SEARCH_DEBOUNCE_MS = 300

export interface UseAssetsFiltersReturn {
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  statusFilter: string
  typeFilter: string
  pageParam: number
  isFiltered: boolean
  listParams: AssetListParams
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleClearFilters: () => void
}

export function useAssetsFilters(): UseAssetsFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const typeFilter = searchParams.get('asset_type') || 'all'
  const pageParam = Number(searchParams.get('page')) || 1

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const isFiltered = statusFilter !== 'all' || typeFilter !== 'all' || Boolean(searchQuery)

  const listParams = useMemo<AssetListParams>(
    () => ({
      page: pageParam,
      page_size: 10,
      search: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      asset_type: typeFilter !== 'all' ? typeFilter : undefined,
    }),
    [pageParam, searchQuery, statusFilter, typeFilter]
  )

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          nextParams.delete(key)
        } else {
          nextParams.set(key, value)
        }
      })
      router.push(`${pathname}?${nextParams.toString()}`)
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        updateQueryParams({ search: localSearch, page: '1' })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [localSearch, searchQuery, updateQueryParams])

  const handleClearFilters = useCallback(() => {
    setLocalSearch('')
    updateQueryParams({ search: '', status: 'all', asset_type: 'all', page: '1' })
  }, [updateQueryParams])

  return {
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    pageParam,
    isFiltered,
    listParams,
    updateQueryParams,
    handleClearFilters,
  }
}
