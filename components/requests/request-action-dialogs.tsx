// components/requests/request-action-dialogs.tsx
'use client'

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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { uiDialog, uiInput, uiOutlineBtn } from '@/lib/ui/design-system'
import type { Request } from './requests-constants'

interface RequestActionDialogsProps {
  approveTarget: Request | null
  isRejectOpen: boolean
  rejectTarget: Request | null
  rejectReason: string
  isSubmitting: boolean
  onRejectReasonChange: (value: string) => void
  onApproveDialogChange: (open: boolean) => void
  onRejectDialogChange: (open: boolean) => void
  onConfirmApprove: () => void
  onConfirmReject: () => void
}

export function RequestActionDialogs({
  approveTarget,
  isRejectOpen,
  rejectTarget,
  rejectReason,
  isSubmitting,
  onRejectReasonChange,
  onApproveDialogChange,
  onRejectDialogChange,
  onConfirmApprove,
  onConfirmReject,
}: RequestActionDialogsProps) {
  return (
    <>
      <AlertDialog open={approveTarget !== null} onOpenChange={onApproveDialogChange}>
        <AlertDialogContent className={cn(uiDialog, 'max-w-md')}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold">Approve request</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Approve &quot;{approveTarget?.title}&quot; submitted by {approveTarget?.requester.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className={cn(uiOutlineBtn, 'text-xs')} disabled={isSubmitting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <PrimaryButton
              type="button"
              onClick={onConfirmApprove}
              isLoading={isSubmitting}
              className="text-xs"
            >
              Approve
            </PrimaryButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRejectOpen} onOpenChange={onRejectDialogChange}>
        <AlertDialogContent className={cn(uiDialog, 'max-w-md')}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold">Reject request</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Reject &quot;{rejectTarget?.title}&quot; and notify {rejectTarget?.requester.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="reject-reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rejection reason
            </Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              placeholder="Explain why this request is being rejected"
              className={cn(uiInput, 'min-h-24 resize-none')}
              disabled={isSubmitting}
            />
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border/40">
            <AlertDialogCancel asChild>
              <Button variant="outline" className={cn(uiOutlineBtn, 'text-xs')} disabled={isSubmitting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={onConfirmReject}
              disabled={isSubmitting || !rejectReason.trim()}
              className="h-10 bg-destructive text-white hover:bg-destructive/90 font-semibold rounded-[20px] [corner-shape:squircle] px-5 text-xs"
            >
              Reject
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
