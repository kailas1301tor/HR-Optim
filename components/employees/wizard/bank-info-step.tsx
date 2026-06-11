// components/employees/wizard/bank-info-step.tsx
'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CommonFormFieldError } from '@/components/common'
import { maskAccountNumber } from '@/lib/helpers/mask-sensitive'
import { uiInput } from '@/lib/ui/design-system'
import type { EmployeeInput } from '@/validations/employee.schema'

interface BankInfoStepProps {
  isEditMode?: boolean
}

export function BankInfoStep({ isEditMode = false }: BankInfoStepProps) {
  const [accountRevealed, setAccountRevealed] = useState(false)

  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const accountValue = watch('account_number')
  const showMaskedAccount = isEditMode && !accountRevealed && Boolean(accountValue)

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
          {showMaskedAccount ? (
            <div className="flex gap-2">
              <Input
                id="emp-account-no"
                readOnly
                value={maskAccountNumber(accountValue)}
                className={uiInput}
                aria-label="Account number (masked)"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 min-h-11 min-w-11"
                onClick={() => setAccountRevealed(true)}
                aria-label="Reveal account number"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                {...register('account_number')}
                id="emp-account-no"
                placeholder="e.g. 1234567890"
                className={uiInput}
                required
              />
              {isEditMode && accountValue && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 min-h-11 min-w-11"
                  onClick={() => setAccountRevealed(false)}
                  aria-label="Mask account number"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
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
