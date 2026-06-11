// components/employees/useEmployeePagination.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const SEARCH_DEBOUNCE_MS = 300

export interface UseEmployeePaginationReturn {
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  departmentFilter: string
  statusFilter: string
  pageParam: number
  activeTab: string
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  setPagination: React.Dispatch<React.SetStateAction<{ totalCount: number; totalPages: number; currentPage: number }>>
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleClearFilters: () => void
}

export function useEmployeePagination(): UseEmployeePaginationReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 })

  const searchQuery = searchParams.get('search') || ''
  const departmentFilter = searchParams.get('department') || ''
  const statusFilter = searchParams.get('status') || ''
  const pageParam = Number(searchParams.get('page')) || 1
  const activeTab = searchParams.get('tab') || 'all'

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
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
    updateQueryParams({ search: '', department: '', status: '', tab: null, page: '1' })
  }, [updateQueryParams])

  return {
    searchQuery,
    localSearch,
    setLocalSearch,
    departmentFilter,
    statusFilter,
    pageParam,
    activeTab,
    pagination,
    setPagination,
    updateQueryParams,
    handleClearFilters,
  }
}
