// components/settings/roles-permissions.tsx
'use client'

import { useState, useEffect, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Shield, Plus, Edit3, Trash2, Check, Lock, Search, AlertCircle, ShieldAlert } from 'lucide-react'
import { RoleMatrixDialog } from './roles/role-matrix-dialog'
import { roleService, type BackendRole } from '@/services/role-service'
import { permissionService, type BackendPermission } from '@/services/permission-service'
import { toast } from 'sonner'

import { Skeleton } from '@/components/ui/skeleton'

function getRoleDescription(name: string, activePerms: string[]): string {
  const nameLower = name.toLowerCase()
  if (nameLower === 'admin' || nameLower === 'super admin') {
    return 'Full system access'
  } else if (nameLower === 'employee') {
    return 'Self-service access'
  } else if (nameLower.includes('finance')) {
    return 'Finance approver for loan and salary advance requests before HR review'
  } else if (nameLower.includes('hr')) {
    return 'HR module access'
  } else if (nameLower.includes('manager')) {
    return 'Line manager with first-level leave approval access'
  } else {
    return activePerms.length > 0
      ? `Access to: ${activePerms.slice(0, 3).join(', ')}${activePerms.length > 3 ? '...' : ''}`
      : 'No permissions configured'
  }
}

const RoleCardSkeleton = () => (
  <div className="bg-midnight border border-border/60 rounded-xl p-4 flex flex-col justify-between min-h-[120px]">
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/3 rounded-md bg-midnight/50" />
      <Skeleton className="h-3 w-3/4 rounded-md bg-midnight/50" />
      <Skeleton className="h-3 w-2/3 rounded-md bg-midnight/50" />
    </div>
  </div>
)

const ExplorerSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-midnight">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/2 rounded-md bg-midnight/50" />
          <Skeleton className="h-2.5 w-1/4 rounded-md bg-midnight/50" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full bg-midnight/50" />
      </div>
    ))}
  </div>
)

export function RolesPermissions() {
  const [roles, setRoles] = useState<BackendRole[]>([])
  const [allPermissions, setAllPermissions] = useState<BackendPermission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(0)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [roleFormName, setRoleFormName] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [roleEditId, setRoleEditId] = useState<number | null>(null)
  
  // Permissions Explorer Search
  const [explorerSearch, setExplorerSearch] = useState('')

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [fetchedRoles, fetchedPermissions] = await Promise.all([
        roleService.getRoles(),
        permissionService.getPermissions()
      ])
      setRoles(fetchedRoles)
      setAllPermissions(fetchedPermissions)
      
      // Default to select first role if available
      if (fetchedRoles.length > 0) {
        setSelectedRoleIndex(0)
      } else {
        setSelectedRoleIndex(null)
      }
    } catch (error) {
      toast.error('Failed to load roles and permissions')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAddRole = () => {
    setRoleFormName('')
    setSelectedPermissionIds([])
    setRoleEditId(null)
    setIsRoleModalOpen(true)
  }

  const handleOpenEditRole = (role: BackendRole) => {
    setRoleFormName(role.name)
    setSelectedPermissionIds(role.permissions.map((p) => p.id))
    setRoleEditId(role.id)
    setIsRoleModalOpen(true)
  }

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleFormName.trim()) return

    setIsSaving(true)
    try {
      if (roleEditId !== null) {
        const updatedRole = await roleService.updateRole(roleEditId, roleFormName.trim(), selectedPermissionIds)
        toast.success(`Role "${updatedRole.name}" updated successfully`)
      } else {
        const newRole = await roleService.createRole(roleFormName.trim(), selectedPermissionIds)
        toast.success(`Role "${newRole.name}" created successfully`)
      }
      setIsRoleModalOpen(false)
      // Refetch roles
      const fetchedRoles = await roleService.getRoles()
      setRoles(fetchedRoles)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Failed to save role')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRole = async (role: BackendRole, index: number) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return

    startTransition(async () => {
      try {
        await roleService.deleteRole(role.id)
        toast.success(`Role "${role.name}" deleted successfully`)
        
        // Remove from local state
        const updatedRoles = roles.filter((r) => r.id !== role.id)
        setRoles(updatedRoles)
        
        if (selectedRoleIndex === index) {
          setSelectedRoleIndex(updatedRoles.length > 0 ? 0 : null)
        } else if (selectedRoleIndex !== null && selectedRoleIndex > index) {
          setSelectedRoleIndex(selectedRoleIndex - 1)
        }
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete role')
      }
    })
  }

  const handleTogglePermissionId = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissionIds([...selectedPermissionIds, id])
    } else {
      setSelectedPermissionIds(selectedPermissionIds.filter((pId) => pId !== id))
    }
  }

  const handleToggleAllGroupPermissions = (ids: number[], check: boolean) => {
    if (check) {
      // Add all ids that are not already selected
      const uniqueIds = Array.from(new Set([...selectedPermissionIds, ...ids]))
      setSelectedPermissionIds(uniqueIds)
    } else {
      // Remove all ids in this list
      setSelectedPermissionIds(selectedPermissionIds.filter((pId) => !ids.includes(pId)))
    }
  }

  // Get active role details
  const activeRole = selectedRoleIndex !== null ? roles[selectedRoleIndex] : null
  const activePermissionNames = activeRole ? activeRole.permissions.map((p) => p.name) : []

  // Filter Explorer permissions
  const filteredPermissions = allPermissions.filter((perm) => {
    if (!explorerSearch.trim()) return true
    return perm.name.toLowerCase().includes(explorerSearch.toLowerCase().trim())
  })

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Roles & Permissions Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">Configure system access levels and permissions per employee role</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-200">System Roles</span>
        <Button
          onClick={handleOpenAddRole}
          disabled={isLoading || isPending}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold flex items-center gap-1 cursor-pointer h-9 px-3 rounded-lg text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Configure Roles
        </Button>
      </div>

      {/* Roles Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border/60 rounded-2xl bg-midnight/20">
          <ShieldAlert className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">No roles configured</p>
          <p className="text-xs text-slate-500 mt-1">Click "Configure Roles" to create a new role</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role, index) => {
            const isSelected = selectedRoleIndex === index
            const rolePermNames = role.permissions.map(p => p.name)
            const description = getRoleDescription(role.name, rolePermNames)
            
            return (
              <div
                key={role.id}
                className={cn(
                  'bg-midnight/40 border rounded-xl p-4 flex flex-col justify-between hover:border-violet-core/50 transition-all group relative min-h-[120px] shadow-sm cursor-pointer',
                  isSelected ? 'border-violet-core ring-1 ring-violet-core/50' : 'border-border/80'
                )}
                onClick={() => setSelectedRoleIndex(index)}
              >
                <div className="space-y-1">
                  <h4 className={cn('font-semibold text-sm', isSelected ? 'text-violet-glow' : 'text-cloud')}>{role.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">{description}</p>
                </div>
                
                <div
                  className={cn(
                    'absolute top-2.5 right-2.5 transition-opacity flex gap-1 bg-midnight/95 p-1 rounded-lg border border-border/50 shadow-lg z-10',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-violet-glow hover:bg-violet-core/20 rounded-md cursor-pointer"
                    onClick={() => handleOpenEditRole(role)}
                    disabled={isPending}
                    title="Edit Role"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  {role.name !== 'Admin' && role.name !== 'Super Admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-400 hover:bg-red-500/20 rounded-md cursor-pointer"
                      onClick={() => handleDeleteRole(role, index)}
                      disabled={isPending}
                      title="Delete Role"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Permissions Explorer Details Card */}
      {selectedRoleIndex !== null && activeRole && (
        <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg mt-6">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-cloud flex items-center gap-2">
                <Shield className="h-4 w-4 text-violet-glow" />
                Permissions Explorer &mdash; {activeRole.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Overview of active privileges. Highlights denote active system permissions.
              </CardDescription>
            </div>
            {/* Explorer Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
                placeholder="Search active permissions..."
                className="pl-8 bg-midnight/60 border-border/60 rounded-lg text-xs h-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ExplorerSkeleton />
            ) : filteredPermissions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500">No permissions found matching search filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPermissions.map((perm) => {
                  const hasPerm = activeRole.permissions.some((p) => p.id === perm.id)
                  return (
                    <div
                      key={perm.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border transition-all',
                        hasPerm
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900/40 border-border/40 text-slate-500 opacity-50'
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">{perm.name}</span>
                        <span className="text-[10px] opacity-80">{hasPerm ? 'Access Granted' : 'Restricted'}</span>
                      </div>
                      {hasPerm ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-500 flex-shrink-0">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Role Matrix Edit/Configure Dialog */}
      <RoleMatrixDialog
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        roleEditId={roleEditId}
        roleFormName={roleFormName}
        setRoleFormName={setRoleFormName}
        selectedPermissionIds={selectedPermissionIds}
        onTogglePermissionId={handleTogglePermissionId}
        onToggleAllGroupPermissions={handleToggleAllGroupPermissions}
        onSaveRole={handleSaveRole}
        allPermissions={allPermissions}
        isSaving={isSaving}
      />
    </div>
  )
}
