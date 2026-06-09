// components/settings/shared/settings-form-dialog.tsx
'use client'

import type { FormEvent, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { uiDialog, uiOutlineBtn } from '@/lib/ui/design-system'

interface SettingsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (e: FormEvent) => void
  children: ReactNode
  size?: 'md' | 'lg' | 'xl'
}

export function SettingsFormDialog({
  open,
  onOpenChange,
  title,
  description,
  isSubmitting = false,
  submitLabel = 'Save',
  onSubmit,
  children,
  size = 'md',
}: SettingsFormDialogProps) {
  const sizeClass =
    size === 'xl' ? 'max-w-2xl' : size === 'lg' ? 'max-w-lg' : 'max-w-md'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(uiDialog, sizeClass, 'max-h-[90vh] overflow-y-auto')}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="py-4 space-y-4">{children}</div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className={cn(uiOutlineBtn, 'text-xs w-full sm:w-auto')}
            >
              Cancel
            </Button>
            <PrimaryButton type="submit" isLoading={isSubmitting} className="text-xs w-full sm:w-auto">
              {submitLabel}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
