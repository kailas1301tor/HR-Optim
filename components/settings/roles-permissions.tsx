// components/settings/roles-permissions.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CommonErrorState } from '@/components/common'
import { useRolesData } from './useRolesData'
import { useRoleActions } from './useRoleActions'
import { useRoleForm } from './useRoleForm'
import { RoleCardSkeleton } from './roles/roles-skeletons'
import { RoleCardList } from './roles/role-card-list'
import { RoleFormView } from './roles/role-form-view'
import { RolePermissionsExplorer } from './roles/role-permissions-explorer'
import type { BackendRole } from '@/services/role-service'

export function RolesPermissions() {
  const {
    roles,
    allPermissions,
    isLoading,
    hasError,
    selectedRoleIndex,
    setSelectedRoleIndex,
    explorerSearch,
    setExplorerSearch,
    filteredExplorerPermissions,
    activeRole,
    refreshData,
  } = useRolesData()

  const {
    action,
    roleEditId,
    isPending,
    handleOpenAddRole,
    handleOpenEditRole,
    handleCancelForm,
    handleDeleteRole,
  } = useRoleActions()

  const {
    roleFormName,
    setRoleFormName,
    selectedPermissionIds,
    formSearchQuery,
    setFormSearchQuery,
    isSaving,
    isLoadingDetails,
    filteredFormPermissions,
    handleTogglePermissionId,
    handleToggleAllPermissions,
    handleSaveRole,
  } = useRoleForm({
    action,
    roleEditId,
    roles,
    allPermissions,
    handleCancelForm,
    refreshRoles: refreshData,
  })

  const onDeleteRole = (role: BackendRole, index: number) => {
    handleDeleteRole(role, index, selectedRoleIndex, setSelectedRoleIndex, refreshData)
  }

  if (action === 'add' || action === 'edit') {
    if ((isLoading || isLoadingDetails) && roles.length === 0 && action === 'edit') {
      return (
        <div className="p-6">
          <RoleCardSkeleton />
        </div>
      )
    }

    return (
      <RoleFormView
        action={action}
        roleFormName={roleFormName}
        setRoleFormName={setRoleFormName}
        selectedPermissionIds={selectedPermissionIds}
        formSearchQuery={formSearchQuery}
        setFormSearchQuery={setFormSearchQuery}
        filteredFormPermissions={filteredFormPermissions}
        isSaving={isSaving}
        isLoadingDetails={isLoadingDetails}
        onCancel={handleCancelForm}
        onSubmit={handleSaveRole}
        onTogglePermissionId={handleTogglePermissionId}
        onToggleAllPermissions={handleToggleAllPermissions}
      />
    )
  }

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Roles & Permissions Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure system access levels and permissions per employee role
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">System Roles</span>
        <Button
          onClick={handleOpenAddRole}
          disabled={isLoading || isPending}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold flex items-center gap-1 cursor-pointer h-9 px-3 rounded-[16px] [corner-shape:squircle] text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Configure Roles
        </Button>
      </div>

      {hasError ? (
        <CommonErrorState
          title="Failed to load roles"
          message="Please check your connection and try again."
          onRetry={refreshData}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <RoleCardList
          roles={roles}
          selectedRoleIndex={selectedRoleIndex}
          setSelectedRoleIndex={setSelectedRoleIndex}
          onEditRole={handleOpenEditRole}
          onDeleteRole={onDeleteRole}
          isPending={isPending}
        />
      )}

      {!hasError && (isLoading || activeRole) && (
        <RolePermissionsExplorer
          isLoading={isLoading}
          activeRole={activeRole}
          explorerSearch={explorerSearch}
          onExplorerSearchChange={setExplorerSearch}
          filteredExplorerPermissions={filteredExplorerPermissions}
        />
      )}
    </div>
  )
}
