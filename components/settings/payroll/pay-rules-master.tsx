// components/settings/payroll/pay-rules-master.tsx
'use client'

import { Calculator, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommonErrorBanner, CommonErrorState } from '@/components/common'
import { SettingsDeleteDialog, SettingsMasterCard } from '@/components/settings/shared'
import { formatPayRuleSubtitle } from '@/lib/mappers/pay-rule-mapper'
import { PayRuleFormDialog } from './pay-rule-form-dialog'
import { usePayRuleChoices } from './usePayRuleChoices'
import { usePayRulesMaster } from './usePayRulesMaster'

export function PayRulesMaster() {
  const {
    choices,
    hasError: choicesHasError,
    reload: reloadChoices,
  } = usePayRuleChoices()

  const {
    items,
    isLoading,
    hasError,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    editingRule,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    reload,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  } = usePayRulesMaster()

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load pay rules"
        message="Please check your connection and try again."
        onRetry={reload}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <>
      {choicesHasError && (
        <CommonErrorBanner
          message="Failed to load pay rule options. Form fields may be incomplete."
          onRetry={reloadChoices}
        />
      )}

      <SettingsMasterCard
        title="Pay Rules"
        items={items.map((rule) => ({
          id: rule.id,
          name: rule.name,
          subtitle: formatPayRuleSubtitle(rule),
        }))}
        isLoading={isLoading}
        emptyIcon={Calculator}
        emptyTitle="No pay rules configured"
        emptyDescription="Add allowance or deduction rules for payroll processing."
        onAdd={handleOpenAdd}
        onEdit={(item) => {
          const rule = items.find((entry) => entry.id === item.id)
          if (rule) handleOpenEdit(rule)
        }}
        onDelete={(item) => {
          const rule = items.find((entry) => entry.id === item.id)
          if (rule) setDeleteTarget(rule)
        }}
        renderActions={(item) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => {
                const rule = items.find((entry) => entry.id === item.id)
                if (rule) handleOpenEdit(rule)
              }}
              aria-label={`Edit ${item.name}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => {
                const rule = items.find((entry) => entry.id === item.id)
                if (rule) setDeleteTarget(rule)
              }}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <PayRuleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        choices={choices}
        editingRule={editingRule}
        isSubmitting={isSubmitting}
        onSubmit={handleSave}
      />

      <SettingsDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
