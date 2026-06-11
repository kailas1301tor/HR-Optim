// components/settings/hr-masters/generic-master-card.tsx
'use client'

import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Trash2, Tags } from 'lucide-react'
import { CommonErrorState } from '@/components/common'
import {
  SettingsMasterCard,
  SettingsFormDialog,
  SettingsDeleteDialog,
} from '@/components/settings/shared'
import { uiInput } from '@/lib/ui/design-system'
import type { SettingsMasterItem } from '@/types/settings'
import { useGenericMasterCard } from './useGenericMasterCard'

export type MasterItem = SettingsMasterItem

interface GenericMasterCardProps {
  title: string
  items: MasterItem[]
  isLoading: boolean
  hasError?: boolean
  onRetry?: () => void
  onSave: (id: number | null, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  placeholder: string
  label: string
}

export function GenericMasterCard({
  title,
  items,
  isLoading,
  hasError = false,
  onRetry,
  onSave,
  onDelete,
  placeholder,
  label,
}: GenericMasterCardProps) {
  const fieldId = useId()
  const {
    isOpen,
    setIsOpen,
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
  } = useGenericMasterCard({ label, onSave, onDelete })

  if (hasError) {
    return (
      <CommonErrorState
        title={`Failed to load ${title.toLowerCase()}`}
        message="Please check your connection and try again."
        onRetry={onRetry ?? (() => {})}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <>
      <SettingsMasterCard
        title={title}
        items={items}
        isLoading={isLoading}
        emptyIcon={Tags}
        emptyTitle={`No ${title.toLowerCase()} yet`}
        emptyDescription={`Add your first ${label.toLowerCase()} to get started.`}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        renderActions={(item) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => handleOpenEdit(item)}
              aria-label={`Edit ${item.name}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => setDeleteTarget(item)}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <SettingsFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={editItem ? `Edit ${label}` : `Add ${label}`}
        description={
          editItem
            ? `Update the ${label.toLowerCase()} name below.`
            : `Enter a name for the new ${label.toLowerCase()}.`
        }
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <Label htmlFor={fieldId} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </Label>
          <Input
            id={fieldId}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder={placeholder}
            className={uiInput}
            required
            disabled={isSubmitting}
          />
        </div>
      </SettingsFormDialog>

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
