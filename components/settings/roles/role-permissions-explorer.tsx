// components/settings/roles/role-permissions-explorer.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Shield, Search, Check, Lock } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'
import { ExplorerSkeleton } from './roles-skeletons'
import type { BackendPermission } from '@/services/permission-service'
import type { BackendRole } from '@/services/role-service'

interface RolePermissionsExplorerProps {
  isLoading: boolean
  activeRole: BackendRole | null
  explorerSearch: string
  onExplorerSearchChange: (query: string) => void
  filteredExplorerPermissions: BackendPermission[]
}

export function RolePermissionsExplorer({
  isLoading,
  activeRole,
  explorerSearch,
  onExplorerSearchChange,
  filteredExplorerPermissions,
}: RolePermissionsExplorerProps) {
  if (!isLoading && !activeRole) return null

  return (
    <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg mt-6">
      <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-sm font-semibold text-cloud flex items-center gap-2">
            <Shield className="h-4 w-4 text-violet-glow" />
            Permissions Explorer {activeRole ? `— ${activeRole.name}` : ''}
          </CardTitle>
          <CardDescription className="text-xs">
            Overview of active privileges. Highlights denote active system permissions.
          </CardDescription>
        </div>
        {!isLoading && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={explorerSearch}
              onChange={(e) => onExplorerSearchChange(e.target.value)}
              placeholder="Search active permissions..."
              className="pl-8 bg-midnight/60 border-border/60 rounded-[16px] [corner-shape:squircle] text-xs h-8"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ExplorerSkeleton />
        ) : filteredExplorerPermissions.length === 0 ? (
          <CommonEmptyState
            icon={Shield}
            title="No permissions found"
            description="No permissions match your search filter."
            className="py-6 shadow-none border-0 bg-transparent"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredExplorerPermissions.map((perm) => {
              const hasPerm = activeRole ? activeRole.permissions.some((p) => p.id === perm.id) : false
              return (
                <div
                  key={perm.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-[20px] [corner-shape:squircle] border transition-all',
                    hasPerm
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-midnight/35 border-border/40 text-slate-500 opacity-50'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider line-clamp-1">
                      {perm.name}
                    </span>
                    <span className="text-[10px] opacity-80">{hasPerm ? 'Access Granted' : 'Restricted'}</span>
                  </div>
                  {hasPerm ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-slate-500 flex-shrink-0">
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
  )
}
