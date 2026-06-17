// components/assets/dispose-asset-dialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Trash2, AlertTriangle } from 'lucide-react'
import { type AssetDropdowns } from '@/types/asset'
import { useDisposeAssetDialog } from './useDisposeAssetDialog'

interface DisposeAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  dropdowns: AssetDropdowns | null
  onSuccess: () => void
}

export function DisposeAssetDialog({ open, onOpenChange, assetId, dropdowns, onSuccess }: DisposeAssetDialogProps) {
  const {
    isSubmitting,
    disposalChoices,
    hasDisposalChoicesError,
    form,
    onSubmit,
  } = useDisposeAssetDialog(open, onOpenChange, assetId, dropdowns, onSuccess)

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
          <DialogTitle className="text-rose-400 font-semibold text-lg flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" /> Dispose & Retire Asset
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs pt-1">
            Decommissioning this asset is a permanent actions. Once retired, it cannot be reassigned or serviced.
          </DialogDescription>
        </DialogHeader>

        {/* Warn details */}
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-[20px] [corner-shape:squircle] flex gap-2 items-start text-[11px] text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Confirming this will update the asset status to "Disposed" and lock editing capabilities.</span>
        </div>

        {hasDisposalChoicesError && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-[20px] [corner-shape:squircle] p-3">
            Disposal methods could not be loaded. Close and try again, or contact your administrator.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Disposal Date */}
          <div className="space-y-1.5">
            <Label htmlFor="disposal_date" className="text-xs text-slate-400">Disposal Date</Label>
            <Input
              id="disposal_date"
              type="date"
              className="bg-midnight border-border"
              {...register('disposal_date')}
            />
            {errors.disposal_date && (
              <p className="text-[11px] text-destructive font-medium">{errors.disposal_date.message}</p>
            )}
          </div>

          {/* Disposal Method dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="disposal_method" className="text-xs text-slate-400">Disposal Method</Label>
            <Select
              disabled={hasDisposalChoicesError}
              onValueChange={(val) => setValue('disposal_method', val, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full bg-midnight border-border">
                <SelectValue placeholder="Select method..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {disposalChoices.map((choice) => (
                  <SelectItem key={choice.id} value={choice.id}>
                    {choice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.disposal_method && (
              <p className="text-[11px] text-destructive font-medium">{errors.disposal_method.message}</p>
            )}
          </div>

          {/* Recovery Value */}
          <div className="space-y-1.5">
            <Label htmlFor="disposal_value" className="text-xs text-slate-400">Recovery Value (AED)</Label>
            <Input
              id="disposal_value"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-midnight border-border"
              {...register('disposal_value')}
            />
            {errors.disposal_value && (
              <p className="text-[11px] text-destructive font-medium">{errors.disposal_value.message}</p>
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
              disabled={isSubmitting || hasDisposalChoicesError}
              className="bg-destructive hover:bg-destructive/95 text-white font-semibold rounded-[20px] [corner-shape:squircle] min-h-11 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Disposing...
                </>
              ) : (
                'Dispose Asset'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
