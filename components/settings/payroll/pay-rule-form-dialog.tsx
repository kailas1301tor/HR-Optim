// components/settings/payroll/pay-rule-form-dialog.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CommonFormFieldError } from '@/components/common'
import { SettingsFormDialog } from '@/components/settings/shared'
import type { DropdownItem } from '@/lib/types'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import { isFixedCalculateType, payRuleToFormValues } from '@/lib/mappers/pay-rule-mapper'
import type { PayRule, PayRuleChoices } from '@/types/settings'
import { payRuleSchema, type PayRuleInput } from '@/validations/pay-rule.schema'

const DEFAULT_FORM_VALUES: PayRuleInput = {
  name: '',
  category: '',
  trigger_basis: '',
  calculate_type: '',
  value: '',
  base: '',
}

interface PayRuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  choices: PayRuleChoices
  editingRule?: PayRule | null
  isSubmitting: boolean
  onSubmit: (data: PayRuleInput) => Promise<void>
}

function ChoiceSelect({
  id,
  label,
  value,
  options,
  placeholder,
  disabled,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: DropdownItem[]
  placeholder: string
  disabled?: boolean
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className={uiSelect}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={`${id}-${option.id}`} value={option.name}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <CommonFormFieldError message={error} />}
    </div>
  )
}

export function PayRuleFormDialog({
  open,
  onOpenChange,
  choices,
  editingRule = null,
  isSubmitting,
  onSubmit,
}: PayRuleFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<PayRuleInput>({
    resolver: zodResolver(payRuleSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(editingRule ? payRuleToFormValues(editingRule) : DEFAULT_FORM_VALUES)
  }, [open, editingRule, reset])

  const calculateType = watch('calculate_type')
  const category = watch('category')
  const triggerBasis = watch('trigger_basis')
  const base = watch('base')
  const isFixed = isFixedCalculateType(calculateType)

  useEffect(() => {
    if (!isFixed) return
    setValue('base', '')
    clearErrors('base')
  }, [isFixed, setValue, clearErrors])

  return (
    <SettingsFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editingRule ? 'Edit Pay Rule' : 'Add Pay Rule'}
      description="Configure allowance or deduction rules for payroll processing."
      isSubmitting={isSubmitting}
      submitLabel={editingRule ? 'Update Rule' : 'Save Rule'}
      onSubmit={handleSubmit(onSubmit)}
      size="lg"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pay-rule-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rule Name
          </Label>
          <Input
            id="pay-rule-name"
            {...register('name')}
            placeholder="e.g. Basic Pay"
            className={uiInput}
            disabled={isSubmitting}
          />
          {errors.name?.message && <CommonFormFieldError message={errors.name.message} />}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceSelect
            id="pay-rule-category"
            label="Category"
            value={category}
            options={choices.category_choices}
            placeholder="Select category"
            disabled={isSubmitting}
            error={errors.category?.message}
            onChange={(val) => setValue('category', val, { shouldValidate: true })}
          />
          <ChoiceSelect
            id="pay-rule-trigger"
            label="Trigger Basis"
            value={triggerBasis}
            options={choices.trigger_basis_choices}
            placeholder="Select trigger basis"
            disabled={isSubmitting}
            error={errors.trigger_basis?.message}
            onChange={(val) => setValue('trigger_basis', val, { shouldValidate: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceSelect
            id="pay-rule-calculate-type"
            label="Calculation Type"
            value={calculateType}
            options={choices.calculate_type_choices}
            placeholder="Select calculation type"
            disabled={isSubmitting}
            error={errors.calculate_type?.message}
            onChange={(val) => setValue('calculate_type', val, { shouldValidate: true })}
          />
          <div className="space-y-2">
            <Label htmlFor="pay-rule-value" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Value
            </Label>
            <Input
              id="pay-rule-value"
              {...register('value')}
              placeholder={isFixed ? 'e.g. 1000.00' : 'e.g. 10'}
              className={uiInput}
              disabled={isSubmitting}
            />
            {errors.value?.message && <CommonFormFieldError message={errors.value.message} />}
          </div>
        </div>

        <div className="space-y-2">
          <ChoiceSelect
            id="pay-rule-base"
            label="Base"
            value={base ?? ''}
            options={choices.base_choices}
            placeholder={isFixed ? 'Not applicable for fixed amount' : 'Select base'}
            disabled={isSubmitting || isFixed}
            error={errors.base?.message}
            onChange={(val) => setValue('base', val, { shouldValidate: true })}
          />
          {isFixed && (
            <p className="text-xs text-muted-foreground">Base is not applicable for fixed amount rules.</p>
          )}
        </div>
      </div>
    </SettingsFormDialog>
  )
}
