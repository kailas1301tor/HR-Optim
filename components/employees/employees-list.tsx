// components/employees/employees-list.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserX } from 'lucide-react'
import { employeeService } from '@/services/employee-service'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorBanner,
  CommonErrorState,
  CommonFilterChips,
  CommonMobileCardGrid,
  CommonPagination,
  TableSkeleton,
} from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types/employee'
import { EmployeesPageHeader } from './employees-page-header'
import { EmployeesStatsCards } from './employees-stats-cards'
import { EmployeesToolbar } from './employees-toolbar'
import { EmployeesTable } from './employees-table'
import { EmployeeCard } from './employee-card'
import { EmployeeCardSkeleton } from './employee-card-skeleton'
import { EmployeeProfileDrawer } from './employee-profile-drawer'
import { AddEmployeeModal } from './add-employee-modal'
import { DeleteEmployeeDialog } from './delete-employee-dialog'
import { useEmployeeTable } from './useEmployeeTable'
import { usePermissions } from '@/components/auth/permissions-provider'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'

const DIRECTORY_TABS = [
  { value: 'all', label: 'All' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'offboarding', label: 'Offboarding' },
]

export function EmployeesList() {
  const { isLoading: isPermissionsLoading, canManage, canView } = usePermissions()
  const canManageEmployees = canManage('employees')
  const canAccessEmployeesSection =
    canView('employees') || canView('onboarding') || canView('offboarding')

  const visibleTabs = useMemo(
    () =>
      DIRECTORY_TABS.filter((tab) => {
        if (tab.value === 'all') return canView('employees')
        if (tab.value === 'onboarding') return canView('onboarding')
        if (tab.value === 'offboarding') return canView('offboarding')
        return false
      }),
    [canView],
  )

  const {
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
    localSearch,
    setLocalSearch,
    departmentFilter,
    statusFilter,
    activeTab,
    hasError,
    dropdownsError,
    dropdownsLoading,
    reloadDropdowns,
    workforceStats,
    setSelectedEmployee,
    setDrawerOpen,
    setIsAddModalOpen,
    setDeleteTargetId,
    setEditTarget,
    fetchEmployees,
    updateQueryParams,
    handleClearFilters,
    togglingStatusEmployeeId,
    handleToggleStatus,
    handleDelete,
    executeDelete,
    handleEdit,
  } = useEmployeeTable({ enabled: canAccessEmployeesSection })

  const router = useRouter()
  const searchParams = useSearchParams()
  const [detailVersion, setDetailVersion] = useState(0)
  const employeeIdParam = searchParams.get('employeeId')

  useEffect(() => {
    if (!employeeIdParam) return
    const currentId = employeeIdParam

    const controller = new AbortController()

    async function autoSelectEmployee() {
      // 1. Check if employee is in current list
      const localMatch = employeeList.find(
        (e) => e.employee_id.toLowerCase() === currentId.toLowerCase()
      )

      if (localMatch) {
        setSelectedEmployee(localMatch)
        setDrawerOpen(true)
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.delete('employeeId')
        const queryString = nextParams.toString()
        router.replace(`/employees${queryString ? `?${queryString}` : ''}`)
        return
      }

      // 2. Fetch from backend if not found locally
      try {
        const result = await employeeService.getEmployees({ search: currentId }, controller.signal)
        const remoteMatch = result.data.find(
          (e) => e.employee_id.toLowerCase() === currentId.toLowerCase()
        )
        if (remoteMatch) {
          setSelectedEmployee(remoteMatch)
          setDrawerOpen(true)
        }
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.delete('employeeId')
        const queryString = nextParams.toString()
        router.replace(`/employees${queryString ? `?${queryString}` : ''}`)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('🔴 Error fetching employee for auto-selection:', error)
      }
    }

    void autoSelectEmployee()
    return () => controller.abort()
  }, [employeeIdParam, employeeList, setSelectedEmployee, setDrawerOpen, searchParams, router])

  useEffect(() => {
    if (searchParams.get('action') === 'add-employee') {
      setIsAddModalOpen(true)
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete('action')
      const queryString = nextParams.toString()
      router.replace(`/employees${queryString ? `?${queryString}` : ''}`)
    }
  }, [searchParams, setIsAddModalOpen, router])

  useEffect(() => {
    const tabAllowed = visibleTabs.some((tab) => tab.value === activeTab)
    if (!tabAllowed) {
      updateQueryParams({ tab: null, page: '1' })
    }
  }, [activeTab, visibleTabs, updateQueryParams])

  const handleAddEmployee = () => {
    setEditTarget(null)
    setIsAddModalOpen(true)
  }

  const handleEmployeeSaved = (employee: Employee) => {
    fetchEmployees()
    if (selectedEmployee?.id === employee.id) {
      setSelectedEmployee(employee)
    }
    setDetailVersion((v) => v + 1)
  }

  const showEmpty = !isTableLoading && !hasError && employeeList.length === 0

  if (isPermissionsLoading || isInitialDataLoading(isTableLoading, employeeList.length, hasError)) {
    return <TableSkeleton showFilterChips filterChipCount={3} />
  }

  return (
    <div className="space-y-6">
      <EmployeesPageHeader onAddEmployee={handleAddEmployee} canManage={canManageEmployees} />

      <EmployeesStatsCards
        totalCount={workforceStats.total}
        activeCount={workforceStats.active}
        onLeaveCount={workforceStats.onLeave}
        onboardingCount={workforceStats.onboarding}
        isPageScoped={workforceStats.isPageScoped}
        isLoading={isTableLoading}
      />

      <CommonFilterChips
        options={visibleTabs}
        value={activeTab}
        onChange={(val) => updateQueryParams({ tab: val === 'all' ? null : val, page: '1' })}
      />

      {dropdownsError && (
        <CommonErrorBanner
          message="Filter options could not be loaded. Department and status filters may be unavailable."
          onRetry={() => void reloadDropdowns()}
        />
      )}

      <EmployeesToolbar
        localSearch={localSearch}
        onSearchChange={setLocalSearch}
        departmentFilter={departmentFilter}
        statusFilter={statusFilter}
        dropdowns={dropdowns}
        onDepartmentChange={(val) => updateQueryParams({ department: val, page: '1' })}
        onStatusChange={(val) => updateQueryParams({ status: val, page: '1' })}
        onAddEmployee={handleAddEmployee}
        canManage={canManageEmployees}
      />

      {hasError ? (
        <CommonErrorState
          title="Failed to load employees"
          message="We couldn't retrieve the employee directory. Check your connection and try again."
          onRetry={() => fetchEmployees()}
        />
      ) : isTableLoading ? (
        <>
          <CommonMobileCardGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <EmployeeCardSkeleton key={idx} />
            ))}
          </CommonMobileCardGrid>
          <EmployeesTable
            employees={[]}
            isLoading
            pagination={pagination}
            onSelect={() => {}}
            onToggleStatus={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onPageChange={() => {}}
          />
        </>
      ) : showEmpty ? (
        <CommonEmptyState
          icon={UserX}
          title="No employees found"
          description="We couldn't find any employees matching your search or filters."
          actions={
            canManageEmployees ? (
            <>
              <PrimaryButton onClick={handleAddEmployee} className="gap-2 h-9 text-xs">
                Add Employee
              </PrimaryButton>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className={cn(uiOutlineBtn, 'h-9 text-xs')}
              >
                Clear Filters
              </Button>
            </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className={cn(uiOutlineBtn, 'h-9 text-xs')}
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <>
          <CommonMobileCardGrid>
            {employeeList.map((employee, index) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                index={index}
                onSelect={() => {
                  setSelectedEmployee(employee)
                  setDrawerOpen(true)
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canManage={canManageEmployees}
              />
            ))}
          </CommonMobileCardGrid>

          {pagination.totalPages > 1 && (
            <CommonPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              onPageChange={(page) => updateQueryParams({ page: String(page) })}
              isLoading={isTableLoading}
              compact
              className="lg:hidden"
            />
          )}

          <EmployeesTable
            employees={employeeList}
            isLoading={isTableLoading}
            pagination={pagination}
            togglingStatusEmployeeId={togglingStatusEmployeeId}
            onSelect={(employee) => {
              setSelectedEmployee(employee)
              setDrawerOpen(true)
            }}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={(page) => updateQueryParams({ page: String(page) })}
            canManage={canManageEmployees}
          />
        </>
      )}

      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) setEditTarget(null)
        }}
        onSuccess={handleEmployeeSaved}
        editEmployee={editTarget}
      />

      <EmployeeProfileDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        detailVersion={detailVersion}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
        canManage={canManageEmployees}
        onboardingDocumentTypes={dropdowns?.onboarding_document_types ?? []}
        offboardingDocumentTypes={dropdowns?.offboarding_document_types ?? []}
        isDropdownLoading={dropdownsLoading}
      />

      <DeleteEmployeeDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={executeDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
