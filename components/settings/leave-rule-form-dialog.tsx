// components/settings/leave-rule-form-dialog.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiSelect } from '@/lib/ui/design-system'
import { leaveRuleSchema, type LeaveRuleInput } from '@/validations/leave-rule.schema'
import type { LeaveType } from '@/services/leave-type-service'
import type { ConfigureLeaveRulePayload, LeaveRule } from '@/services/leave-rule-service'
import { mapLeaveRuleToFormValues } from '@/lib/mappers/leave-rule-mapper'

const DEFAULT_FORM_VALUES: LeaveRuleInput = {
  leave_type: 0,
  max_days: 12,
  is_carry_forward: true,
  carry_forward_limit: 5,
  accrual_rate: 1,
  accrual_frequency: 'monthly',
  is_paid_leave: true,
  description: '',
}

interface LeaveRuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaveTypes: LeaveType[]
  editingRule?: LeaveRule | null
  isSubmitting: boolean
  onSubmit: (payload: ConfigureLeaveRulePayload) => Promise<void>
}

export function LeaveRuleFormDialog({
  open,
  onOpenChange,
  leaveTypes,
  editingRule = null,
  isSubmitting,
  onSubmit,
}: LeaveRuleFormDialogProps) {
  const isEditing = Boolean(editingRule)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveRuleInput>({
    resolver: zodResolver(leaveRuleSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(editingRule ? mapLeaveRuleToFormValues(editingRule) : DEFAULT_FORM_VALUES)
  }, [open, editingRule, reset])

  const isCarryForward = watch('is_carry_forward')
  const isPaidLeave = watch('is_paid_leave')
  const leaveTypeValue = watch('leave_type')
  const accrualFrequency = watch('accrual_frequency')

  const handleFormSubmit = async (data: LeaveRuleInput): Promise<void> => {
    await onSubmit({
      leave_type: data.leave_type,
      max_days: data.max_days,
      is_carry_forward: data.is_carry_forward,
      carry_forward_limit: data.carry_forward_limit,
      accrual_rate: data.accrual_rate,
      accrual_frequency: data.accrual_frequency,
      is_paid_leave: data.is_paid_leave,
      description: data.description,
    })
    reset()
  }

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) reset(DEFAULT_FORM_VALUES)
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg">
            {isEditing ? 'Edit Leave Rule' : 'Configure Leave Rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Leave Type
              </Label>
              <Select
                value={leaveTypeValue ? String(leaveTypeValue) : ''}
                onValueChange={(val) => setValue('leave_type', Number(val), { shouldValidate: true })}
                disabled={isEditing}
              >
                <SelectTrigger className={uiSelect}>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leave_type && (
                <p className="text-xs text-destructive">{errors.leave_type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-days" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Max Days / Year
              </Label>
              <Input
                id="max-days"
                type="number"
                step="0.5"
                {...register('max_days')}
                className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm"
              />
              {errors.max_days && (
                <p className="text-xs text-destructive">{errors.max_days.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carry-forward" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Carry Forward Limit
              </Label>
              <Input
                id="carry-forward"
                type="number"
                step="0.5"
                {...register('carry_forward_limit')}
                disabled={!isCarryForward}
                className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm"
              />
              {errors.carry_forward_limit && (
                <p className="text-xs text-destructive">{errors.carry_forward_limit.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accrual-rate" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accrual Rate
              </Label>
              <Input
                id="accrual-rate"
                type="number"
                step="0.1"
                {...register('accrual_rate')}
                className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm"
              />
              {errors.accrual_rate && (
                <p className="text-xs text-destructive">{errors.accrual_rate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accrual Frequency
              </Label>
              <Select
                value={accrualFrequency}
                onValueChange={(val) =>
                  setValue('accrual_frequency', val as 'monthly' | 'yearly', { shouldValidate: true })
                }
              >
                <SelectTrigger className={uiSelect}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 flex flex-col justify-end pb-1">
              <div className="flex items-center gap-3">
                <Switch
                  checked={isCarryForward}
                  onCheckedChange={(checked) => setValue('is_carry_forward', checked)}
                />
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Allow Carry Forward
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={isPaidLeave}
                  onCheckedChange={(checked) => setValue('is_paid_leave', checked)}
                />
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Paid Leave
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="e.g. Standard leave rule for annual leaves."
              className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 rounded-[20px] [corner-shape:squircle]">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[20px] [corner-shape:squircle] px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Rule'
              ) : (
                'Save Rule'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
