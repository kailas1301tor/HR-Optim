// components/assets/return-asset-dialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
import { Loader2, ArrowLeft } from 'lucide-react'
import { type Department } from '@/types/settings'
import { useReturnAssetDialog } from './useReturnAssetDialog'

interface ReturnAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  onSuccess: () => void
}

export function ReturnAssetDialog({ open, onOpenChange, assetId, onSuccess }: ReturnAssetDialogProps) {
  const {
    departments,
    isLoadingDepts,
    isSubmitting,
    form,
    onSubmit,
  } = useReturnAssetDialog(open, onOpenChange, assetId, onSuccess)

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
            <ArrowLeft className="w-5 h-5 text-violet-glow" /> Return Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Target Department Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="return_to_department" className="text-xs text-slate-400">Return to Department</Label>
            <Select
              disabled={isLoadingDepts}
              onValueChange={(val) => setValue('return_to_department', Number(val), { shouldValidate: true })}
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
            {errors.return_to_department && (
              <p className="text-[11px] text-destructive font-medium">{errors.return_to_department.message}</p>
            )}
          </div>

          {/* Return Date input */}
          <div className="space-y-1.5">
            <Label htmlFor="return_date" className="text-xs text-slate-400">Return Date</Label>
            <Input
              id="return_date"
              type="date"
              className="bg-midnight border-border"
              {...register('return_date')}
            />
            {errors.return_date && (
              <p className="text-[11px] text-destructive font-medium">{errors.return_date.message}</p>
            )}
          </div>

          {/* Optional Service Cost */}
          <div className="space-y-1.5">
            <Label htmlFor="service_cost" className="text-xs text-slate-400">Final Maintenance/Servicing Cost (AED — Optional)</Label>
            <Input
              id="service_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-midnight border-border"
              {...register('service_cost')}
            />
            {errors.service_cost && (
              <p className="text-[11px] text-destructive font-medium">{errors.service_cost.message}</p>
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Returning...
                </>
              ) : (
                'Return Asset'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
