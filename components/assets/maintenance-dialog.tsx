// components/assets/maintenance-dialog.tsx
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
import { Loader2, Wrench } from 'lucide-react'
import { type AssetDropdowns } from '@/types/asset'
import { useMaintenanceDialog } from './useMaintenanceDialog'

interface MaintenanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  dropdowns: AssetDropdowns | null
  onSuccess: () => void
}

export function MaintenanceDialog({ open, onOpenChange, assetId, dropdowns, onSuccess }: MaintenanceDialogProps) {
  const {
    isSubmitting,
    serviceTypes,
    providers,
    form,
    onSubmit,
  } = useMaintenanceDialog(open, onOpenChange, assetId, dropdowns, onSuccess)

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
            <Wrench className="w-5 h-5 text-violet-glow" /> Schedule Maintenance
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Service Type Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="service_type" className="text-xs text-slate-400">Service Category</Label>
            <Select
              onValueChange={(val) => setValue('service_type', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className="w-full bg-midnight border-border">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p className="text-[11px] text-destructive font-medium">{errors.service_type.message}</p>
            )}
          </div>

          {/* Service Provider Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="service_provider" className="text-xs text-slate-400">Maintenance Shop / Provider</Label>
            <Select
              onValueChange={(val) => setValue('service_provider', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className="w-full bg-midnight border-border">
                <SelectValue placeholder="Select provider..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {providers.map((prov) => (
                  <SelectItem key={prov.id} value={String(prov.id)}>
                    {prov.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_provider && (
              <p className="text-[11px] text-destructive font-medium">{errors.service_provider.message}</p>
            )}
          </div>

          {/* Estimated Cost */}
          <div className="space-y-1.5">
            <Label htmlFor="estimated_cost" className="text-xs text-slate-400">Estimated Cost (AED)</Label>
            <Input
              id="estimated_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-midnight border-border"
              {...register('estimated_cost')}
            />
            {errors.estimated_cost && (
              <p className="text-[11px] text-destructive font-medium">{errors.estimated_cost.message}</p>
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Scheduling...
                </>
              ) : (
                'Schedule Maintenance'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
