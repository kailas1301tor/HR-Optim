// components/requests/useRequestsList.ts
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRequestsFilters } from './useRequestsFilters'
import { useRequestStatusCounts } from './useRequestStatusCounts'
import { useRequestEmployeeSearch } from './useRequestEmployeeSearch'
import { useRequestsData } from './useRequestsData'
import type { Request } from '@/types/request'

export type { RequestTypeFilter, StatusCounts } from '@/types/request'

export interface UseRequestsListReturn {
  paginatedRequests: Request[]
  statusCounts: ReturnType<typeof useRequestStatusCounts>['statusCounts']
  isLoading: boolean
  isCountsLoading: boolean
  countsHasError: boolean
  hasError: boolean
  isListCapped: boolean
  isSearchClientScoped: boolean
  totalPages: number
  pageParam: number
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  statusFilter: ReturnType<typeof useRequestsFilters>['statusFilter']
  typeFilter: ReturnType<typeof useRequestsFilters>['typeFilter']
  expandedRequest: string | null
  setStatusFilter: ReturnType<typeof useRequestsFilters>['setStatusFilter']
  setTypeFilter: ReturnType<typeof useRequestsFilters>['setTypeFilter']
  handleToggleExpand: (id: string) => void
  handleClearFilters: () => void
  handleRetry: () => void
  reloadCounts: () => void
  employeeFilter: number | null
  employees: ReturnType<typeof useRequestEmployeeSearch>['employees']
  isEmployeesLoading: boolean
  employeesHasError: boolean
  employeeSearchQuery: string
  setEmployeeSearchQuery: (query: string) => void
  setEmployeeFilter: ReturnType<typeof useRequestsFilters>['setEmployeeFilter']
  updateQueryParams: ReturnType<typeof useRequestsFilters>['updateQueryParams']
}

export function useRequestsList(): UseRequestsListReturn {
  const filters = useRequestsFilters()
  const {
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    employeeFilter,
    pageParam,
    typesToFetch,
    isSearchClientScoped,
    updateQueryParams,
    setStatusFilter,
    setTypeFilter,
    setEmployeeFilter,
    handleClearFilters,
  } = filters

  const {
    employees,
    isEmployeesLoading,
    employeesHasError,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    reloadEmployees,
  } = useRequestEmployeeSearch()
  const [reloadToken, setReloadToken] = useState(0)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  const { statusCounts, isCountsLoading, countsHasError } = useRequestStatusCounts({
    typesToFetch,
    employeeFilter,
    reloadToken,
  })

  const {
    paginatedRequests,
    isLoading,
    hasError,
    isListCapped,
    totalPages,
  } = useRequestsData({
    statusFilter,
    typesToFetch,
    employeeFilter,
    pageParam,
    searchQuery,
    reloadToken,
  })

  const refreshList = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  const handleRetry = useCallback(() => {
    reloadEmployees()
    refreshList()
  }, [reloadEmployees, refreshList])

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedRequest((prev) => (prev === id ? null : id))
  }, [])

  useEffect(() => {
    setExpandedRequest(null)
  }, [statusFilter, typeFilter, employeeFilter, pageParam, searchQuery])

  useEffect(() => {
    if (isLoading || pageParam <= totalPages) return
    updateQueryParams({ page: totalPages <= 1 ? null : String(totalPages) })
  }, [isLoading, pageParam, totalPages, updateQueryParams])

  return {
    paginatedRequests,
    statusCounts,
    isLoading,
    isCountsLoading,
    countsHasError,
    hasError,
    isListCapped,
    isSearchClientScoped,
    totalPages,
    pageParam,
    searchQuery,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    expandedRequest,
    setStatusFilter,
    setTypeFilter,
    handleToggleExpand,
    handleClearFilters,
    handleRetry,
    reloadCounts: refreshList,
    employeeFilter,
    employees,
    isEmployeesLoading,
    employeesHasError,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    setEmployeeFilter,
    updateQueryParams,
  }
}
