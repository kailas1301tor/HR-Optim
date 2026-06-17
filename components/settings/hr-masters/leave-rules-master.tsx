// components/settings/hr-masters/leave-rules-master.tsx
'use client'

import { Edit3, Scale, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommonErrorState } from '@/components/common'
import { SettingsDeleteDialog, SettingsMasterCard } from '@/components/settings/shared'
import { LeaveRuleFormDialog } from '@/components/settings/leave-rule-form-dialog'
import { getLeaveTypeName } from '@/lib/mappers/leave-rule-mapper'
import { useLeaveRulesMaster } from './useLeaveRulesMaster'

export function LeaveRulesMaster() {
  const {
    items,
    leaveRules,
    leaveTypes,
    isLoading,
    hasError,
    isSubmitting,
    editingRule,
    isDialogOpen,
    setIsDialogOpen,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfigureRule,
    handleOpenConfigure,
    handleOpenEdit,
    handleOpenDelete,
    handleDeleteRule,
    reload,
  } = useLeaveRulesMaster()

  const deleteItemName = deleteTarget
    ? `${getLeaveTypeName(leaveTypes, deleteTarget.leave_type)} Policy`
    : undefined

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load leave rules"
        message="Please check your connection and try again."
        onRetry={reload}
      />
    )
  }

  return (
    <>
      <SettingsMasterCard
        title="Leave Rules"
        items={items}
        isLoading={isLoading}
        emptyIcon={Scale}
        emptyTitle="No leave rules configured yet"
        emptyDescription="Configure a leave policy for each leave type."
        onAdd={handleOpenConfigure}
        onEdit={(item) => handleOpenEdit(item.id)}
        onDelete={(item) => handleOpenDelete(item.id)}
        renderActions={(item) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => handleOpenEdit(item.id)}
              aria-label={`Edit ${item.name}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => handleOpenDelete(item.id)}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <LeaveRuleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        leaveTypes={leaveTypes}
        editingRule={editingRule}
        isSubmitting={isSubmitting}
        onSubmit={handleConfigureRule}
      />

      <SettingsDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteItemName}
        isDeleting={isDeleting}
        onConfirm={handleDeleteRule}
      />
    </>
  )
}
