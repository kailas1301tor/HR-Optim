// components/assets/transfer-asset-dialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, RefreshCw } from 'lucide-react'
import { type Department } from '@/types/settings'
import { useTransferAssetDialog } from './useTransferAssetDialog'

interface TransferAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  onSuccess: () => void
}

export function TransferAssetDialog({ open, onOpenChange, assetId, onSuccess }: TransferAssetDialogProps) {
  const {
    departments,
    isLoadingDepts,
    isSubmitting,
    form,
    onSubmit,
  } = useTransferAssetDialog(open, onOpenChange, assetId, onSuccess)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = form

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) reset()
    }}>
      <DialogContent className="bg-card text-foreground border border-border/80 rounded-[32px] [corner-shape:squircle] max-w-md p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-violet-glow" /> Transfer Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Target Department Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="transfer_to_department" className="text-xs text-slate-400">Target Department</Label>
            <Select
              disabled={isLoadingDepts}
              onValueChange={(val) => setValue('transfer_to_department', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className="w-full bg-midnight border-border">
                <SelectValue placeholder={isLoadingDepts ? 'Loading...' : 'Select department...'} />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.transfer_to_department && (
              <p className="text-[11px] text-destructive font-medium">{errors.transfer_to_department.message}</p>
            )}
          </div>

          {/* Remarks text */}
          <div className="space-y-1.5">
            <Label htmlFor="remarks" className="text-xs text-slate-400">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Explain the reason for transfer, new custodian, or physical location updates..."
              className="bg-midnight border-border min-h-[80px]"
              {...register('remarks')}
            />
            {errors.remarks && (
              <p className="text-[11px] text-destructive font-medium">{errors.remarks.message}</p>
            )}
          </div>

          <DialogFooter className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-[20px] [corner-shape:squircle] h-10 w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-[20px] [corner-shape:squircle] h-10 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Transferring...
                </>
              ) : (
                'Transfer Asset'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
