// components/employees/wizard/bank-info-step.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CommonFormFieldError } from '@/components/common'
import { uiInput } from '@/lib/ui/design-system'
import type { EmployeeInput } from '@/validations/employee.schema'

export function BankInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Bank Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-bank-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bank Name
          </Label>
          <Input
            {...register('bank_name')}
            id="emp-bank-name"
            placeholder="e.g. Global Bank, FAB"
            className={uiInput}
            required
          />
          {errors.bank_name?.message && <CommonFormFieldError message={errors.bank_name.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-account-no" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account Number
          </Label>
          <Input
            {...register('account_number')}
            id="emp-account-no"
            placeholder="e.g. 1234567890"
            className={uiInput}
            required
          />
          {errors.account_number?.message && <CommonFormFieldError message={errors.account_number.message} />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-ifsc" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            IFSC / Routing Code
          </Label>
          <Input
            {...register('ifsc')}
            id="emp-ifsc"
            placeholder="e.g. GLOB0001"
            className={uiInput}
            required
          />
          {errors.ifsc?.message && <CommonFormFieldError message={errors.ifsc.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-branch" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Branch Name
          </Label>
          <Input
            {...register('branch')}
            id="emp-branch"
            placeholder="e.g. Downtown"
            className={uiInput}
            required
          />
          {errors.branch?.message && <CommonFormFieldError message={errors.branch.message} />}
        </div>
      </div>
    </div>
  )
}
