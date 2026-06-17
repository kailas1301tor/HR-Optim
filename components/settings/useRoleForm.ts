// components/settings/useRoleForm.ts
import { useState, useEffect, useMemo, useRef } from 'react'
import { roleService, type BackendRole } from '@/services/role-service'
import { type BackendPermission } from '@/services/permission-service'
import { toast } from 'sonner'
import { roleNameSchema } from '@/validations/settings-master.schema'

export interface UseRoleFormProps {
  action: string
  roleEditId: number | null
  roles: BackendRole[]
  allPermissions: BackendPermission[]
  handleCancelForm: () => void
  refreshRoles: () => Promise<void>
}

export interface UseRoleFormReturn {
  roleFormName: string
  setRoleFormName: (name: string) => void
  selectedPermissionIds: number[]
  setSelectedPermissionIds: (ids: number[]) => void
  formSearchQuery: string
  setFormSearchQuery: (query: string) => void
  isSaving: boolean
  isLoadingDetails: boolean
  isFormReady: boolean
  sortedPermissions: BackendPermission[]
  filteredFormPermissions: BackendPermission[]
  handleTogglePermissionId: (id: number, checked: boolean) => void
  handleToggleAllPermissions: (ids: number[], check: boolean) => void
  handleSaveRole: (e: React.FormEvent) => Promise<void>
}

export function useRoleForm({
  action,
  roleEditId,
  roles,
  allPermissions,
  handleCancelForm,
  refreshRoles,
}: UseRoleFormProps): UseRoleFormReturn {
  const [roleFormName, setRoleFormName] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [formSearchQuery, setFormSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isFormReady, setIsFormReady] = useState(false)
  const fetchIdRef = useRef(0)
  const handleCancelFormRef = useRef(handleCancelForm)
  const syncedFormKeyRef = useRef<string | null>(null)

  useEffect(() => {
    handleCancelFormRef.current = handleCancelForm
  }, [handleCancelForm])

  const applyRoleToForm = (name: string, permissionIds: number[]): void => {
    setRoleFormName((prev) => (prev === name ? prev : name))
    setSelectedPermissionIds((prev) => {
      if (prev.length === permissionIds.length && prev.every((id, index) => id === permissionIds[index])) {
        return prev
      }
      return permissionIds
    })
    setIsLoadingDetails(false)
    setIsFormReady(true)
  }

  useEffect(() => {
    const formKey = `${action}:${roleEditId ?? 'new'}`

    if (action === 'add') {
      if (syncedFormKeyRef.current === formKey) return
      syncedFormKeyRef.current = formKey
      setRoleFormName('')
      setSelectedPermissionIds([])
      setFormSearchQuery('')
      setIsLoadingDetails(false)
      setIsFormReady(true)
      return
    }

    if (action !== 'edit' || roleEditId === null) {
      syncedFormKeyRef.current = null
      setIsFormReady(false)
      return
    }

    if (syncedFormKeyRef.current === formKey) return

    setIsFormReady(false)

    const role = roles.find((r) => Number(r.id) === Number(roleEditId))
    if (role) {
      syncedFormKeyRef.current = formKey
      const permissionIds = (role.permissions ?? []).map((p) => p.id)
      applyRoleToForm(role.name, permissionIds)
      return
    }

    if (roles.length === 0) {
      if (!isLoadingDetails) {
        setIsLoadingDetails(true)
      }
      return
    }

    syncedFormKeyRef.current = formKey

    const fetchId = ++fetchIdRef.current
    setIsLoadingDetails(true)

    const fetchRoleDetails = async (): Promise<void> => {
      try {
        const roleDetails = await roleService.getRoleById(roleEditId)
        if (fetchId !== fetchIdRef.current) return
        if (roleDetails) {
          const permissionIds = (roleDetails.permissions ?? []).map((p) => p.id)
          applyRoleToForm(roleDetails.name, permissionIds)
        } else {
          toast.error('Role not found')
          handleCancelFormRef.current()
        }
      } catch {
        if (fetchId !== fetchIdRef.current) return
        toast.error('Failed to load role details')
        handleCancelFormRef.current()
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoadingDetails(false)
        }
      }
    }

    void fetchRoleDetails()

    return () => {
      fetchIdRef.current += 1
    }
  }, [action, roleEditId, roles.length])

  const handleTogglePermissionId = (id: number, checked: boolean): void => {
    setSelectedPermissionIds((prev) => {
      const isSelected = prev.includes(id)
      if (checked) {
        return isSelected ? prev : [...prev, id]
      }
      return isSelected ? prev.filter((pId) => pId !== id) : prev
    })
  }

  const handleToggleAllPermissions = (ids: number[], check: boolean): void => {
    setSelectedPermissionIds((prev) => {
      if (check) {
        const merged = Array.from(new Set([...prev, ...ids]))
        if (merged.length === prev.length) return prev
        return merged
      }
      const next = prev.filter((pId) => !ids.includes(pId))
      return next.length === prev.length ? prev : next
    })
  }

  const sortedPermissions = useMemo(() => {
    return allPermissions.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [allPermissions])

  const filteredFormPermissions = useMemo(() => {
    const query = formSearchQuery.toLowerCase().trim()
    if (!query) return sortedPermissions
    return sortedPermissions.filter((p) => p.name.toLowerCase().includes(query))
  }, [sortedPermissions, formSearchQuery])

  const handleSaveRole = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const parsed = roleNameSchema.safeParse(roleFormName)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Role name is required')
      return
    }

    setIsSaving(true)
    try {
      if (roleEditId !== null) {
        const updatedRole = await roleService.updateRole(roleEditId, parsed.data, selectedPermissionIds)
        await roleService.assignPermissionsToGroup(roleEditId, selectedPermissionIds)
        toast.success(`Role "${updatedRole.name}" updated successfully`)
      } else {
        const newRole = await roleService.createRole(parsed.data, selectedPermissionIds)
        await roleService.assignPermissionsToGroup(newRole.id, selectedPermissionIds)
        toast.success(`Role "${newRole.name}" created successfully`)
      }
      handleCancelForm()
      await refreshRoles()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save role'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    roleFormName,
    setRoleFormName,
    selectedPermissionIds,
    setSelectedPermissionIds,
    formSearchQuery,
    setFormSearchQuery,
    isSaving,
    isLoadingDetails,
    isFormReady,
    sortedPermissions,
    filteredFormPermissions,
    handleTogglePermissionId,
    handleToggleAllPermissions,
    handleSaveRole,
  }
}
