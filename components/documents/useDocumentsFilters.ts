// components/documents/useDocumentsFilters.ts
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { uiStatusToApiFilter } from '@/lib/mappers/document-mapper'
import type { DocumentTab } from '@/types/document'

const SEARCH_DEBOUNCE_MS = 300

export interface DocumentListParams {
  search?: string
  document_type?: string
  status?: string
}

export interface UseDocumentsFiltersReturn {
  tab: DocumentTab
  statusFilter: string
  categoryFilter: string
  localSearch: string
  setLocalSearch: (query: string) => void
  listParams: DocumentListParams
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleTabChange: (newTab: string) => void
  handleClearFilters: () => void
  handleStatusCardSelect: (key: string) => void
}

export function useDocumentsFilters(): UseDocumentsFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab = ((searchParams.get('tab') as DocumentTab) || 'employee') as DocumentTab
  const statusFilter = searchParams.get('status') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'
  const urlSearchQuery = searchParams.get('search') || ''

  const [localSearch, setLocalSearch] = useState(urlSearchQuery)

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
      router.replace(`${pathname}?${nextParams.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const listParams = useMemo<DocumentListParams>(() => {
    const docTypeParam = categoryFilter !== 'all' ? categoryFilter : undefined
    const statusParam = uiStatusToApiFilter(statusFilter)
    const searchParam = urlSearchQuery || undefined

    return {
      ...(searchParam ? { search: searchParam } : {}),
      ...(docTypeParam ? { document_type: docTypeParam } : {}),
      ...(statusParam ? { status: statusParam } : {}),
    }
  }, [categoryFilter, statusFilter, urlSearchQuery])

  useEffect(() => {
    setLocalSearch(urlSearchQuery)
  }, [urlSearchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== urlSearchQuery) {
        updateQueryParams({ search: localSearch })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [localSearch, urlSearchQuery, updateQueryParams])

  const handleTabChange = useCallback(
    (newTab: string) => {
      const nextParams = new URLSearchParams()
      nextParams.set('tab', newTab)
      router.replace(`${pathname}?${nextParams.toString()}`)
      setLocalSearch('')
    },
    [pathname, router]
  )

  const handleClearFilters = useCallback(() => {
    updateQueryParams({ status: 'all', category: 'all', search: '' })
    setLocalSearch('')
  }, [updateQueryParams])

  const handleStatusCardSelect = useCallback(
    (key: string) => {
      updateQueryParams({ status: statusFilter === key ? 'all' : key })
    },
    [statusFilter, updateQueryParams]
  )

  return {
    tab,
    statusFilter,
    categoryFilter,
    localSearch,
    setLocalSearch,
    listParams,
    updateQueryParams,
    handleTabChange,
    handleClearFilters,
    handleStatusCardSelect,
  }
}
