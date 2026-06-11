// components/settings/useRoleActions.ts
import { useTransition, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { roleService, type BackendRole } from '@/services/role-service'
import { toast } from 'sonner'

export interface UseRoleActionsReturn {
  action: string
  roleIdParam: string
  roleEditId: number | null
  isPending: boolean
  handleOpenAddRole: () => void
  handleOpenEditRole: (role: BackendRole) => void
  handleCancelForm: () => void
  handleDeleteRole: (
    role: BackendRole,
    index: number,
    selectedRoleIndex: number | null,
    setSelectedRoleIndex: (i: number | null) => void,
    refreshData: () => Promise<void>
  ) => Promise<void>
}

export function useRoleActions(): UseRoleActionsReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const action = searchParams.get('action') || ''
  const roleIdParam = searchParams.get('role_id') || ''
  const roleEditId = roleIdParam ? parseInt(roleIdParam, 10) : null

  const handleOpenAddRole = useCallback((): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('action', 'add')
    params.delete('role_id')
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const handleOpenEditRole = useCallback((role: BackendRole): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('action', 'edit')
    params.set('role_id', String(role.id))
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const handleCancelForm = useCallback((): void => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('action')
    params.delete('role_id')
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const handleDeleteRole = useCallback(async (
    role: BackendRole,
    index: number,
    selectedRoleIndex: number | null,
    setSelectedRoleIndex: (i: number | null) => void,
    refreshData: () => Promise<void>
  ): Promise<void> => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return

    startTransition(async () => {
      try {
        await roleService.deleteRole(role.id)
        toast.success(`Role "${role.name}" deleted successfully`)

        if (selectedRoleIndex === index) {
          setSelectedRoleIndex(null)
        } else if (selectedRoleIndex !== null && selectedRoleIndex > index) {
          setSelectedRoleIndex(selectedRoleIndex - 1)
        }

        await refreshData()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete role'
        toast.error(message)
      }
    })
  }, [])

  return {
    action,
    roleIdParam,
    roleEditId,
    isPending,
    handleOpenAddRole,
    handleOpenEditRole,
    handleCancelForm,
    handleDeleteRole,
  }
}
