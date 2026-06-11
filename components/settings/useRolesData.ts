// components/settings/useRolesData.ts
import { useState, useEffect, useMemo, useRef } from 'react'
import { roleService, type BackendRole } from '@/services/role-service'
import { permissionService, type BackendPermission } from '@/services/permission-service'
import { toast } from 'sonner'

export interface UseRolesDataReturn {
  roles: BackendRole[]
  allPermissions: BackendPermission[]
  isLoading: boolean
  hasError: boolean
  selectedRoleIndex: number | null
  setSelectedRoleIndex: (index: number | null) => void
  explorerSearch: string
  setExplorerSearch: (query: string) => void
  filteredExplorerPermissions: BackendPermission[]
  activeRole: BackendRole | null
  setRoles: React.Dispatch<React.SetStateAction<BackendRole[]>>
  refreshData: () => Promise<void>
}

export function useRolesData(): UseRolesDataReturn {
  const [roles, setRoles] = useState<BackendRole[]>([])
  const [allPermissions, setAllPermissions] = useState<BackendPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null)
  const [explorerSearch, setExplorerSearch] = useState('')
  const requestIdRef = useRef(0)

  const loadData = async (): Promise<void> => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setHasError(false)
    try {
      const [fetchedRoles, fetchedPermissions] = await Promise.all([
        roleService.getRoles(),
        permissionService.getPermissions(),
      ])
      if (requestId !== requestIdRef.current) return
      setRoles(fetchedRoles)
      setAllPermissions(fetchedPermissions)
      setSelectedRoleIndex(fetchedRoles.length > 0 ? 0 : null)
    } catch {
      if (requestId !== requestIdRef.current) return
      setHasError(true)
      setRoles([])
      setAllPermissions([])
      setSelectedRoleIndex(null)
      toast.error('Failed to load roles and permissions')
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const activeRole =
    selectedRoleIndex !== null && selectedRoleIndex < roles.length
      ? roles[selectedRoleIndex]
      : null

  const filteredExplorerPermissions = useMemo(() => {
    return allPermissions.filter((perm) => {
      if (!explorerSearch.trim()) return true
      return perm.name.toLowerCase().includes(explorerSearch.toLowerCase().trim())
    })
  }, [allPermissions, explorerSearch])

  return {
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
    setRoles,
    refreshData: loadData,
  }
}
