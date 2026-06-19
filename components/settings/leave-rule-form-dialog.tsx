// components/settings/leave-rule-form-dialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LeaveRuleForm } from './leave-rule-form'
import type { LeaveType } from '@/services/leave-type-service'
import type { ConfigureLeaveRulePayload, LeaveRule } from '@/services/leave-rule-service'
import type { StringDropdownItem } from '@/lib/types'

interface LeaveRuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaveTypes: LeaveType[]
  frequencyChoices: StringDropdownItem[]
  editingRule?: LeaveRule | null
  isSubmitting: boolean
  onSubmit: (payload: ConfigureLeaveRulePayload) => Promise<void>
}

export function LeaveRuleFormDialog({
  open,
  onOpenChange,
  leaveTypes,
  frequencyChoices,
  editingRule = null,
  isSubmitting,
  onSubmit,
}: LeaveRuleFormDialogProps): React.JSX.Element {
  const isEditing = Boolean(editingRule)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg">
            {isEditing ? 'Edit Leave Rule' : 'Configure Leave Rule'}
          </DialogTitle>
        </DialogHeader>

        <LeaveRuleForm
          leaveTypes={leaveTypes}
          frequencyChoices={frequencyChoices}
          editingRule={editingRule}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
