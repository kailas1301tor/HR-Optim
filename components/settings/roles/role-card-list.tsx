// components/settings/roles/role-card-list.tsx
'use client'

import { ShieldAlert, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BackendRole } from '@/services/role-service'

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

interface RoleCardListProps {
  roles: BackendRole[]
  selectedRoleIndex: number | null
  setSelectedRoleIndex: (index: number) => void
  onEditRole: (role: BackendRole) => void
  onDeleteRole: (role: BackendRole, index: number) => void
  isPending: boolean
}

export function RoleCardList({
  roles,
  selectedRoleIndex,
  setSelectedRoleIndex,
  onEditRole,
  onDeleteRole,
  isPending,
}: RoleCardListProps) {
  if (roles.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-border/60 rounded-2xl bg-midnight/20">
        <ShieldAlert className="h-8 w-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm text-slate-400 font-medium">No roles configured</p>
        <p className="text-xs text-slate-500 mt-1">Click "Configure Roles" to create a new role</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map((role, index) => {
        const isSelected = selectedRoleIndex === index
        const rolePermNames = role.permissions.map((p) => p.name)
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
              <h4 className={cn('font-semibold text-sm', isSelected ? 'text-violet-glow' : 'text-cloud')}>
                {role.name}
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">{description}</p>
            </div>

            <div
              className={cn(
                'absolute top-2.5 right-2.5 transition-opacity flex gap-1 bg-midnight/95 p-1 rounded-lg border border-border/50 shadow-lg z-10',
                isSelected ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-violet-glow hover:bg-violet-core/20 rounded-md cursor-pointer"
                onClick={() => onEditRole(role)}
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
                  onClick={() => onDeleteRole(role, index)}
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
  )
}
