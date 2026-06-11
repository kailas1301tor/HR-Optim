// components/settings/hr-masters/leave-rules-master.tsx
'use client'

import { Edit3, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommonErrorState } from '@/components/common'
import { SettingsMasterCard } from '@/components/settings/shared'
import { LeaveRuleFormDialog } from '@/components/settings/leave-rule-form-dialog'
import { useLeaveRulesMaster } from './useLeaveRulesMaster'

export function LeaveRulesMaster() {
  const {
    items,
    leaveTypes,
    isLoading,
    hasError,
    isSubmitting,
    editingRule,
    isDialogOpen,
    setIsDialogOpen,
    handleConfigureRule,
    handleOpenConfigure,
    handleOpenEdit,
    reload,
  } = useLeaveRulesMaster()

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
        onDelete={() => {}}
        renderActions={(item) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
            onClick={() => handleOpenEdit(item.id)}
            aria-label={`Edit ${item.name}`}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
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
    </>
  )
}
