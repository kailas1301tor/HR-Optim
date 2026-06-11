// components/assets/add-asset-modal.tsx
'use client'

import { Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import type { Asset, AssetDropdowns } from '@/types/asset'
import type { Department } from '@/services/department-service'
import { useAddAssetModal } from './useAddAssetModal'

interface AddAssetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editAsset?: Asset | null
  dropdowns: AssetDropdowns | null
  departments: Department[]
}

export function AddAssetModal({
  open,
  onOpenChange,
  onSuccess,
  editAsset,
  dropdowns,
  departments,
}: AddAssetModalProps) {
  const { isSubmitting, form, onSubmit } = useAddAssetModal(
    open,
    onOpenChange,
    onSuccess,
    editAsset,
    dropdowns,
    departments
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] max-w-xl md:max-w-2xl overflow-y-auto max-h-[90vh] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg">
            {editAsset ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Name *</Label>
              <Input
                placeholder="e.g. MacBook Pro 16"
                {...register('name')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Serial Number</Label>
              <Input
                placeholder="e.g. C02X1234ABCD"
                {...register('serial_number')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
              {errors.serial_number && <p className="text-[11px] text-destructive">{errors.serial_number.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Type *</Label>
              <Controller
                name="asset_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_types.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.asset_type && <p className="text-[11px] text-destructive">{errors.asset_type.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Asset Category *</Label>
              <Controller
                name="asset_category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.asset_category && <p className="text-[11px] text-destructive">{errors.asset_category.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Department *</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && <p className="text-[11px] text-destructive">{errors.department.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Status *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-midnight border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdowns?.asset_status.map((status) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-[11px] text-destructive">{errors.status.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Location</Label>
              <Input
                placeholder="e.g. HQ - Floor 3"
                {...register('location')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Sub Location</Label>
              <Input
                placeholder="e.g. Desk 4"
                {...register('sub_location')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Purchase Cost (AED)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 5000.00"
                {...register('purchase_cost')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Purchase Date</Label>
              <Input
                type="date"
                {...register('purchase_date')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Warranty Period (Months)</Label>
              <Input
                type="number"
                placeholder="e.g. 12"
                {...register('warranty_period')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Service Due Date</Label>
              <Input
                type="date"
                {...register('service_due_date')}
                className="bg-midnight border-border"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="min-h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-core hover:bg-violet-deep text-white min-h-11"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editAsset ? 'Save Changes' : 'Add Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
