// components/employees/useEmployeeTable.ts
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { employeeService } from '@/services/employee-service'
import { onboardingOffboardingService } from '@/services/onboarding-offboarding-service'
import { resolveActiveInactiveStatus } from '@/lib/mappers/employee-form-mapper'
import type { Employee } from '@/types/employee'
import { toast } from 'sonner'
import { useEmployeePagination } from './useEmployeePagination'
import { useEmployeeDropdowns } from './useEmployeeDropdowns'
import { useEmployeeUiState } from './useEmployeeUiState'

export interface WorkforceStats {
  total: number
  active: number
  onLeave: number
  onboarding: number
  isPageScoped: boolean
}

export interface UseEmployeeTableReturn {
  employeeList: Employee[]
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  selectedEmployee: Employee | null
  drawerOpen: boolean
  isAddModalOpen: boolean
  editTarget: Employee | null
  isTableLoading: boolean
  dropdowns: ReturnType<typeof useEmployeeDropdowns>['dropdowns']
  dropdownsError: boolean
  reloadDropdowns: () => Promise<void>
  deleteTargetId: number | null
  isDeleting: boolean
  searchQuery: string
  localSearch: string
  setLocalSearch: (query: string) => void
  departmentFilter: string
  statusFilter: string
  activeTab: string
  hasError: boolean
  workforceStats: WorkforceStats
  setSelectedEmployee: (emp: Employee | null) => void
  setDrawerOpen: (open: boolean) => void
  setIsAddModalOpen: (open: boolean) => void
  setDeleteTargetId: (id: number | null) => void
  setEditTarget: (target: Employee | null) => void
  fetchEmployees: (signal?: AbortSignal) => Promise<void>
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleClearFilters: () => void
  handleToggleStatus: (employee: Employee, active: boolean) => Promise<void>
  handleDelete: (id: number) => void
  executeDelete: () => Promise<void>
  handleEdit: (employee: Employee) => void
}

export function useEmployeeTable(): UseEmployeeTableReturn {
  const {
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
  } = useEmployeePagination()

  const { dropdowns, hasError: dropdownsError, reload: reloadDropdowns } = useEmployeeDropdowns()
  const ui = useEmployeeUiState()

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const fetchIdRef = useRef(0)

  const fetchEmployees = async (signal?: AbortSignal) => {
    const fetchId = ++fetchIdRef.current
    setIsTableLoading(true)
    setHasError(false)
    try {
      const params = {
        page: pageParam,
        page_size: 10,
        search: searchQuery || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
      }

      const response =
        activeTab === 'onboarding'
          ? await onboardingOffboardingService.getOnboardingEmployees(params, signal)
          : activeTab === 'offboarding'
            ? await onboardingOffboardingService.getOffboardingEmployees(params, signal)
            : await employeeService.getEmployees(params, signal)

      if (signal?.aborted || fetchId !== fetchIdRef.current) return

      setEmployeeList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      if (fetchId !== fetchIdRef.current) return
      setHasError(true)
      toast.error('Failed to load employees')
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsTableLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchEmployees(controller.signal)
    return () => controller.abort()
  }, [searchQuery, departmentFilter, statusFilter, pageParam, activeTab])

  const workforceStats = useMemo<WorkforceStats>(() => {
    const isPageScoped =
      pagination.totalPages > 1 ||
      Boolean(searchQuery || departmentFilter || statusFilter || activeTab !== 'all')

    return {
      total: pagination.totalCount,
      active: employeeList.filter((e) => e.status?.toLowerCase() === 'active').length,
      onLeave: employeeList.filter((e) => e.status?.toLowerCase().includes('leave')).length,
      onboarding: employeeList.filter((e) => e.status?.toLowerCase().includes('onboarding')).length,
      isPageScoped,
    }
  }, [
    pagination.totalCount,
    pagination.totalPages,
    employeeList,
    searchQuery,
    departmentFilter,
    statusFilter,
    activeTab,
  ])

  const handleToggleStatus = async (employee: Employee, active: boolean) => {
    const nextStatus = resolveActiveInactiveStatus(dropdowns, active)
    try {
      await employeeService.updateEmployee({ id: employee.id, status: nextStatus })
      toast.success(`Status updated to ${nextStatus}`)
      fetchEmployees()
    } catch {
      toast.error('Failed to update employee status')
    }
  }

  const executeDelete = async () => {
    if (ui.deleteTargetId === null) return
    ui.setIsDeleting(true)
    try {
      await employeeService.deleteEmployee(ui.deleteTargetId)
      toast.success('Employee deleted successfully')
      ui.setDeleteTargetId(null)
      if (ui.selectedEmployee?.id === ui.deleteTargetId) {
        ui.setSelectedEmployee(null)
        ui.setDrawerOpen(false)
      }
      fetchEmployees()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error occurred during deletion'
      toast.error('Failed to delete employee', { description: message })
    } finally {
      ui.setIsDeleting(false)
    }
  }

  return {
    employeeList,
    pagination,
    selectedEmployee: ui.selectedEmployee,
    drawerOpen: ui.drawerOpen,
    isAddModalOpen: ui.isAddModalOpen,
    editTarget: ui.editTarget,
    isTableLoading,
    dropdowns,
    dropdownsError,
    reloadDropdowns,
    deleteTargetId: ui.deleteTargetId,
    isDeleting: ui.isDeleting,
    searchQuery,
    localSearch,
    setLocalSearch,
    departmentFilter,
    statusFilter,
    activeTab,
    hasError,
    workforceStats,
    setSelectedEmployee: ui.setSelectedEmployee,
    setDrawerOpen: ui.setDrawerOpen,
    setIsAddModalOpen: ui.setIsAddModalOpen,
    setDeleteTargetId: ui.setDeleteTargetId,
    setEditTarget: ui.setEditTarget,
    fetchEmployees,
    updateQueryParams,
    handleClearFilters,
    handleToggleStatus,
    handleDelete: ui.handleDelete,
    executeDelete,
    handleEdit: ui.handleEdit,
  }
}
