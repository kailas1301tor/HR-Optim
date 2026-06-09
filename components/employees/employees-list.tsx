// components/employees/employees-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonFilterChips,
  CommonMobileCardGrid,
  CommonPagination,
} from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
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

const DIRECTORY_TABS = [
  { value: 'all', label: 'All' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'offboarding', label: 'Offboarding' },
]

export function EmployeesList() {
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
    setIsAddModalOpen,
    setDeleteTargetId,
    setEditTarget,
    fetchEmployees,
    updateQueryParams,
    handleToggleStatus,
    handleSort,
    handleDelete,
    executeDelete,
    handleEdit,
  } = useEmployeeTable()

  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        updateQueryParams({ search: localSearch, page: '1' })
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [localSearch, searchQuery])

  const handleAddEmployee = () => {
    setEditTarget(null)
    setIsAddModalOpen(true)
  }

  const handleClearFilters = () => {
    setLocalSearch('')
    updateQueryParams({ search: '', department: '', status: '', tab: null, page: '1' })
  }

  const showEmpty = !isTableLoading && !hasError && sortedEmployees.length === 0

  return (
    <div className="space-y-6">
      <EmployeesPageHeader onAddEmployee={handleAddEmployee} />

      <EmployeesStatsCards
        totalCount={workforceStats.total}
        activeCount={workforceStats.active}
        onLeaveCount={workforceStats.onLeave}
        onboardingCount={workforceStats.onboarding}
        isLoading={isTableLoading}
      />

      <CommonFilterChips
        options={DIRECTORY_TABS}
        value={activeTab}
        onChange={(val) => updateQueryParams({ tab: val === 'all' ? null : val, page: '1' })}
      />

      <EmployeesToolbar
        localSearch={localSearch}
        onSearchChange={setLocalSearch}
        departmentFilter={departmentFilter}
        statusFilter={statusFilter}
        dropdowns={dropdowns}
        onDepartmentChange={(val) => updateQueryParams({ department: val, page: '1' })}
        onStatusChange={(val) => updateQueryParams({ status: val, page: '1' })}
        onAddEmployee={handleAddEmployee}
      />

      {hasError && (
        <CommonErrorState
          title="Failed to load employees"
          message="We couldn't retrieve the employee directory. Check your connection and try again."
          onRetry={() => fetchEmployees()}
        />
      )}

      {isTableLoading ? (
        <>
          <CommonMobileCardGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <EmployeeCardSkeleton key={idx} />
            ))}
          </CommonMobileCardGrid>
          <EmployeesTable
            employees={[]}
            isLoading
            sortField={sortField}
            sortOrder={sortOrder}
            pagination={pagination}
            onSort={handleSort}
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
          }
        />
      ) : (
        <>
          <CommonMobileCardGrid>
            {sortedEmployees.map((employee, index) => (
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
            employees={sortedEmployees}
            isLoading={isTableLoading}
            sortField={sortField}
            sortOrder={sortOrder}
            pagination={pagination}
            onSort={handleSort}
            onSelect={(employee) => {
              setSelectedEmployee(employee)
              setDrawerOpen(true)
            }}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={(page) => updateQueryParams({ page: String(page) })}
          />
        </>
      )}

      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => fetchEmployees()}
        editEmployee={editTarget}
      />

      <EmployeeProfileDrawer
        employee={selectedEmployee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
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
