// components/settings/shared/settings-delete-dialog.tsx
'use client'

import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiOutlineBtn } from '@/lib/ui/design-system'

interface SettingsDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  isDeleting?: boolean
  onConfirm: () => void
}

export function SettingsDeleteDialog({
  open,
  onOpenChange,
  title = 'Delete item',
  description,
  itemName,
  isDeleting = false,
  onConfirm,
}: SettingsDeleteDialogProps) {
  const message =
    description ??
    (itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : 'Are you sure you want to delete this item? This action cannot be undone.')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 shadow-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cloud font-semibold text-lg">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-sm mt-2">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/40">
          <AlertDialogCancel asChild>
            <Button variant="outline" className={cn(uiOutlineBtn, 'text-xs')} disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-[20px] [corner-shape:squircle] px-5 flex items-center gap-2 text-xs"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
