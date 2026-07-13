// components/settings/leave-rule-form.tsx
'use client'


import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import type { StringDropdownItem } from '@/lib/types'

const DEFAULT_FORM_VALUES: LeaveRuleInput = {
  leave_type: 0,
  max_days: 12,
  is_carry_forward: true,
  carry_forward_limit: 5,
  accrual_rate: 1,
  accrual_frequency: 'monthly',
  is_paid_leave: true,
  description: '',
  is_document_required: false,
}

interface LeaveRuleFormProps {
  leaveTypes: LeaveType[]
  frequencyChoices: StringDropdownItem[]
  editingRule?: LeaveRule | null
  isSubmitting: boolean
  onSubmit: (payload: ConfigureLeaveRulePayload) => Promise<void>
  onCancel: () => void
}

export function LeaveRuleForm({
  leaveTypes,
  frequencyChoices,
  editingRule = null,
  isSubmitting,
  onSubmit,
  onCancel,
}: LeaveRuleFormProps): React.JSX.Element {
  const isEditing = Boolean(editingRule)

  const initialValues = editingRule
    ? mapLeaveRuleToFormValues(editingRule)
    : DEFAULT_FORM_VALUES

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeaveRuleInput>({
    resolver: zodResolver(leaveRuleSchema),
    defaultValues: initialValues,
    values: initialValues,
  })

  const isCarryForward = watch('is_carry_forward')
  const isPaidLeave = watch('is_paid_leave')
  const leaveTypeValue = watch('leave_type')
  const accrualFrequency = watch('accrual_frequency')
  const isDocumentRequired = watch('is_document_required')

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
      is_document_required: data.is_document_required,
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Leave Type
          </Label>
          <Select
            value={leaveTypeValue ? String(leaveTypeValue) : ''}
            onValueChange={(val) => setValue('leave_type', Number(val), { shouldValidate: true })}
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
              setValue('accrual_frequency', val, { shouldValidate: true })
            }
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencyChoices.map((choice) => (
                <SelectItem key={choice.id} value={String(choice.id)}>
                  {choice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accrual_frequency && (
            <p className="text-xs text-destructive">{errors.accrual_frequency.message}</p>
          )}
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
          <div className="flex items-center gap-3">
            <Switch
              checked={isDocumentRequired}
              onCheckedChange={(checked) => setValue('is_document_required', checked)}
            />
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Document Required
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

      <div className="pt-4 border-t border-border/40 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-10 rounded-[20px] [corner-shape:squircle]"
        >
          Cancel
        </Button>
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
      </div>
    </form>
  )
}
