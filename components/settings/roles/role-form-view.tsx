// components/settings/roles/role-form-view.tsx
'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Shield, Search, Loader2, ArrowLeft, CheckSquare, Square, Lock } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'
import { ExplorerSkeleton } from './roles-skeletons'
import type { BackendPermission } from '@/services/permission-service'

interface RoleFormViewProps {
  action: 'add' | 'edit'
  roleFormName: string
  setRoleFormName: (name: string) => void
  selectedPermissionIds: number[]
  formSearchQuery: string
  setFormSearchQuery: (query: string) => void
  filteredFormPermissions: BackendPermission[]
  isSaving: boolean
  isLoadingDetails?: boolean
  onCancel: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onTogglePermissionId: (id: number, checked: boolean) => void
  onToggleAllPermissions: (ids: number[], checked: boolean) => void
}

export function RoleFormView({
  action,
  roleFormName,
  setRoleFormName,
  selectedPermissionIds,
  formSearchQuery,
  setFormSearchQuery,
  filteredFormPermissions,
  isSaving,
  isLoadingDetails = false,
  onCancel,
  onSubmit,
  onTogglePermissionId,
  onToggleAllPermissions,
}: RoleFormViewProps) {
  const filteredIds = filteredFormPermissions.map((p) => p.id)
  const checkedCount = filteredFormPermissions.filter((p) => selectedPermissionIds.includes(p.id)).length
  const isAllChecked = filteredIds.length > 0 && checkedCount === filteredIds.length

  return (
    <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg">
      <CardHeader className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCancel}
            disabled={isSaving}
            className="h-9 w-9 rounded-[20px] [corner-shape:squircle] cursor-pointer"
            aria-label="Back to roles list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-cloud font-semibold text-base flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-violet-glow" />
              {action === 'edit' ? 'Edit Role Details' : 'Configure New Role'}
            </CardTitle>
            <CardDescription className="text-xs">
              {action === 'edit'
                ? 'Modify role name and adjust access privilege configurations.'
                : 'Define a new system role name and choose permissions.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {isLoadingDetails ? (
        <div className="p-6">
          <ExplorerSkeleton />
        </div>
      ) : (
      <form onSubmit={onSubmit} className="space-y-6 pt-6 CardContent p-6">
        <div className="space-y-2">
          <Label htmlFor="role-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Role Name
          </Label>
          <Input
            id="role-name"
            value={roleFormName}
            onChange={(e) => setRoleFormName(e.target.value)}
            placeholder="e.g. Payroll Specialist"
            className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm h-11"
            required
            disabled={isSaving}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Configure Permissions Matrix ({selectedPermissionIds.length} Selected)
            </Label>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={formSearchQuery}
                  onChange={(e) => setFormSearchQuery(e.target.value)}
                  placeholder="Search permissions..."
                  className="pl-8 bg-midnight border-border/60 rounded-[16px] [corner-shape:squircle] text-xs h-8.5"
                  disabled={isSaving}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSaving || filteredFormPermissions.length === 0}
                onClick={() => onToggleAllPermissions(filteredIds, !isAllChecked)}
                className="text-[10px] font-semibold text-slate-400 hover:text-violet-glow h-8.5 px-3.5 flex items-center gap-1 border border-border/50 hover:bg-violet-core/10 rounded-[16px] [corner-shape:squircle] cursor-pointer flex-shrink-0"
              >
                {isAllChecked ? (
                  <>
                    <Square className="h-3 w-3" /> Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-3 w-3" /> Select All ({filteredFormPermissions.length})
                  </>
                )}
              </Button>
            </div>
          </div>

          {filteredFormPermissions.length === 0 ? (
            <CommonEmptyState
              icon={Lock}
              title="No permissions match"
              description="Try a different search term to find permissions."
              className="py-10 shadow-none border border-dashed border-border/50 rounded-[32px] [corner-shape:squircle] bg-midnight/20"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border border-border/40 rounded-[32px] [corner-shape:squircle] p-4 bg-midnight/25 shadow-inner">
              {filteredFormPermissions.map((perm) => {
                const isChecked = selectedPermissionIds.includes(perm.id)
                return (
                  <div
                    key={perm.id}
                    onClick={() => onTogglePermissionId(perm.id, !isChecked)}
                    className={cn(
                      'flex items-center gap-3.5 p-4 border rounded-[20px] [corner-shape:squircle] transition-all duration-200 cursor-pointer select-none',
                      isChecked
                        ? 'bg-violet-core/10 border-violet-core/80 shadow-[0_0_12px_rgba(139,92,246,0.08)]'
                        : 'bg-midnight/35 border-border/60 hover:border-violet-core/50'
                    )}
                  >
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => onTogglePermissionId(perm.id, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isSaving}
                      className="border-slate-400 dark:border-slate-600 data-[state=checked]:border-violet-core data-[state=checked]:bg-violet-core size-4.5"
                    />
                    <Label
                      htmlFor={`perm-${perm.id}`}
                      className={cn(
                        'text-xs font-semibold leading-relaxed cursor-pointer transition-colors',
                        isChecked ? 'text-violet-glow' : 'text-slate-600 dark:text-slate-400'
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {perm.name}
                    </Label>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-10 rounded-[20px] [corner-shape:squircle] cursor-pointer"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-[20px] [corner-shape:squircle] px-6 cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              'Save Access Configuration'
            )}
          </Button>
        </div>
      </form>
      )}
    </Card>
  )
}
