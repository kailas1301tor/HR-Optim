// components/employees/useEmployeeTable.ts
'use client'

import { useState, useEffect } from 'react'
import { employeeService, type DropdownData } from '@/services/employee-service'
import { onboardingOffboardingService } from '@/services/onboarding-offboarding-service'
import type { Employee } from './employee-table-types'
import { toast } from 'sonner'
import { useEmployeePagination } from './useEmployeePagination'

type SortField = 'full_name' | 'department' | 'designation' | 'joined_date' | 'status'
type SortOrder = 'asc' | 'desc'

export interface UseEmployeeTableReturn {
  employeeList: Employee[]
  pagination: { totalCount: number; totalPages: number; currentPage: number }
  selectedEmployee: Employee | null
  drawerOpen: boolean
  isAddModalOpen: boolean
  editTarget: Employee | null
  isTableLoading: boolean
  dropdowns: DropdownData | null
  deleteTargetId: number | null
  isDeleting: boolean
  searchQuery: string
  departmentFilter: string
  statusFilter: string
  sortField: SortField
  sortOrder: SortOrder
  activeTab: string
  sortedEmployees: Employee[]
  hasError: boolean
  workforceStats: { total: number; active: number; onLeave: number; onboarding: number }
  setSelectedEmployee: (emp: Employee | null) => void
  setDrawerOpen: (open: boolean) => void
  setIsAddModalOpen: (open: boolean) => void
  setDeleteTargetId: (id: number | null) => void
  setEditTarget: (target: Employee | null) => void
  fetchEmployees: (signal?: AbortSignal) => Promise<void>
  updateQueryParams: (updates: Record<string, string | null>) => void
  handleToggleStatus: (employee: Employee, active: boolean) => Promise<void>
  handleSort: (field: SortField) => void
  handleDelete: (id: number) => void
  executeDelete: () => Promise<void>
  handleEdit: (employee: Employee) => void
}

export function useEmployeeTable(): UseEmployeeTableReturn {
  const {
    searchQuery,
    departmentFilter,
    statusFilter,
    pageParam,
    sortField,
    sortOrder,
    activeTab,
    pagination,
    setPagination,
    updateQueryParams,
  } = useEmployeePagination()

  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isAddModalOpen, setIsAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [workforceStats, setWorkforceStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    onboarding: 0,
  })

  const fetchEmployees = async (signal?: AbortSignal) => {
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

      let response
      if (activeTab === 'onboarding') {
        response = await onboardingOffboardingService.getOnboardingEmployees(params, signal)
      } else if (activeTab === 'offboarding') {
        response = await onboardingOffboardingService.getOffboardingEmployees(params, signal)
      } else {
        response = await employeeService.getEmployees(params, signal)
      }

      if (signal?.aborted) return

      setEmployeeList(response.data)
      setPagination({
        totalCount: response.total_count,
        totalPages: response.total_pages,
        currentPage: response.current_page,
      })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      setHasError(true)
      toast.error('Failed to load employees')
    } finally {
      if (!signal?.aborted) {
        setIsTableLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchEmployees(controller.signal)
    return () => {
      controller.abort()
    }
  }, [searchQuery, departmentFilter, statusFilter, pageParam, activeTab])

  useEffect(() => {
    const isFiltered = Boolean(searchQuery || departmentFilter || statusFilter || activeTab !== 'all')
    if (isFiltered) {
      setWorkforceStats({
        total: pagination.totalCount,
        active: employeeList.filter((e) => e.status?.toLowerCase() === 'active').length,
        onLeave: employeeList.filter((e) => e.status?.toLowerCase().includes('leave')).length,
        onboarding: employeeList.filter((e) => e.status?.toLowerCase().includes('onboarding')).length,
      })
      return
    }

    const controller = new AbortController()
    async function loadStats() {
      try {
        const response = await employeeService.getEmployees({ page: 1, page_size: 500 }, controller.signal)
        if (controller.signal.aborted) return
        const data = response.data
        setWorkforceStats({
          total: response.total_count,
          active: data.filter((e) => e.status?.toLowerCase() === 'active').length,
          onLeave: data.filter((e) => e.status?.toLowerCase().includes('leave')).length,
          onboarding: data.filter((e) => e.status?.toLowerCase().includes('onboarding')).length,
        })
      } catch {
        if (controller.signal.aborted) return
        setWorkforceStats({
          total: pagination.totalCount,
          active: 0,
          onLeave: 0,
          onboarding: 0,
        })
      }
    }
    loadStats()
    return () => controller.abort()
  }, [searchQuery, departmentFilter, statusFilter, activeTab, pagination.totalCount, employeeList])

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await employeeService.getDropdowns()
        setDropdowns(data)
      } catch (err: unknown) {
        console.error('Failed to load filter metadata:', err)
      }
    }
    loadFilters()
  }, [])

  const handleToggleStatus = async (employee: Employee, active: boolean) => {
    const nextStatus = active ? 'Active' : 'Inactive'
    try {
      await employeeService.updateEmployee({ id: employee.id, status: nextStatus })
      toast.success(`Status updated to ${nextStatus}`)
      fetchEmployees()
    } catch (err: unknown) {
      toast.error('Failed to update employee status')
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      updateQueryParams({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      updateQueryParams({ sortField: field, sortOrder: 'asc' })
    }
  }

  const handleDelete = (id: number) => {
    setDeleteTargetId(id)
  }

  const executeDelete = async () => {
    if (deleteTargetId === null) return
    setIsDeleting(true)
    try {
      await employeeService.deleteEmployee(deleteTargetId)
      toast.success('Employee deleted successfully')
      setDeleteTargetId(null)
      fetchEmployees()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error occurred during deletion'
      toast.error('Failed to delete employee', {
        description: message,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditTarget(employee)
    setIsAddOpen(true)
  }

  const sortedEmployees = [...employeeList].sort((a, b) => {
    const aVal = a[sortField] || ''
    const bVal = b[sortField] || ''
    const order = sortOrder === 'asc' ? 1 : -1
    return aVal < bVal ? -order : aVal > bVal ? order : 0
  })

  return {
    employeeList,
    pagination,
    selectedEmployee,
    drawerOpen,
    isAddModalOpen,
    editTarget,
    isTableLoading,
    dropdowns,
    deleteTargetId,
    isDeleting,
    searchQuery,
    departmentFilter,
    statusFilter,
    sortField,
    sortOrder,
    activeTab,
    sortedEmployees,
    hasError,
    workforceStats,
    setSelectedEmployee,
    setDrawerOpen,
    setIsAddModalOpen: setIsAddOpen,
    setDeleteTargetId,
    setEditTarget,
    fetchEmployees,
    updateQueryParams,
    handleToggleStatus,
    handleSort,
    handleDelete,
    executeDelete,
    handleEdit,
  }
}
