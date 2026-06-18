// components/settings/hr-masters/useGenericMasterCard.ts
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { masterNameSchema } from '@/validations/settings-master.schema'
import type { MasterItem } from './generic-master-card'

export interface UseGenericMasterCardProps {
  label: string
  onSave: (id: number | null, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export interface UseGenericMasterCardReturn {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editItem: MasterItem | null
  formValue: string
  setFormValue: (val: string) => void
  formError: string | null
  isFormValid: boolean
  isSubmitting: boolean
  deleteTarget: MasterItem | null
  setDeleteTarget: (item: MasterItem | null) => void
  isDeleting: boolean
  handleOpenAdd: () => void
  handleOpenEdit: (item: MasterItem) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useGenericMasterCard({
  label,
  onSave,
  onDelete,
}: UseGenericMasterCardProps): UseGenericMasterCardReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [editItem, setEditItem] = useState<MasterItem | null>(null)
  const [formValue, setFormValue] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<MasterItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isFormValid = useMemo(() => masterNameSchema.safeParse(formValue).success, [formValue])

  const handleOpenAdd = (): void => {
    setFormValue('')
    setFormError(null)
    setEditItem(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (item: MasterItem): void => {
    setFormValue(item.name)
    setFormError(null)
    setEditItem(item)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const parsed = masterNameSchema.safeParse(formValue)
    if (!parsed.success) {
      setFormError(parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? 'Invalid name')
      return
    }

    setFormError(null)
    setIsSubmitting(true)
    try {
      await onSave(editItem?.id ?? null, parsed.data.toUpperCase())
      setIsOpen(false)
      toast.success(editItem ? `${label} updated successfully` : `${label} created successfully`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to save ${label.toLowerCase()}`
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await onDelete(deleteTarget.id)
      toast.success(`${label} deleted successfully`)
      setDeleteTarget(null)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Failed to delete ${label.toLowerCase()}`
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open && !isSubmitting) {
      setFormValue('')
      setFormError(null)
      setEditItem(null)
    }
    if (!isSubmitting) setIsOpen(open)
  }

  const handleSetFormValue = (val: string): void => {
    setFormValue(val)
    if (formError) setFormError(null)
  }

  return {
    isOpen,
    setIsOpen: handleDialogOpenChange,
    editItem,
    formValue,
    setFormValue: handleSetFormValue,
    formError,
    isFormValid,
    isSubmitting,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
