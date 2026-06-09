// components/employees/delete-employee-dialog.tsx
'use client'

import { SettingsDeleteDialog } from '@/components/settings/shared'

interface DeleteEmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteEmployeeDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteEmployeeDialogProps) {
  return (
    <SettingsDeleteDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Delete Employee Profile"
      description="Are you sure you want to delete this employee? This action is permanent and cannot be undone. All associated data will be deactivated."
      isDeleting={isDeleting}
      onConfirm={onConfirm}
    />
  )
}
