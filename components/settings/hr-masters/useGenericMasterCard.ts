// components/settings/hr-masters/useGenericMasterCard.ts
import { useState } from 'react'
import { toast } from 'sonner'
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<MasterItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenAdd = (): void => {
    setFormValue('')
    setEditItem(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (item: MasterItem): void => {
    setFormValue(item.name)
    setEditItem(item)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!formValue.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(editItem?.id ?? null, formValue.trim().toUpperCase())
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
      setEditItem(null)
    }
    if (!isSubmitting) setIsOpen(open)
  }

  return {
    isOpen,
    setIsOpen: handleDialogOpenChange,
    editItem,
    formValue,
    setFormValue,
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
