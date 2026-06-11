import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CommonFormFieldError } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import type { EmployeeInput } from '@/validations/employee.schema'
import type { DropdownData } from '@/types/employee'

interface PersonalInfoStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function PersonalInfoStep({ isEditMode = false, dropdowns }: PersonalInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentNationality = watch('nationality')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-dob" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Date of Birth
          </Label>
          <Input
            {...register('date_of_birth')}
            id="emp-dob"
            type="date"
            className={cn(uiInput, 'text-slate-300')}
            required
          />
          {errors.date_of_birth?.message && <CommonFormFieldError message={errors.date_of_birth.message} />}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nationality
          </Label>
          <Select
            value={currentNationality || undefined}
            onValueChange={(val) => setValue('nationality', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Nationality" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.nationalities.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality?.message && <CommonFormFieldError message={errors.nationality.message} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-address" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Residential Address
        </Label>
        <Input
          {...register('address')}
          id="emp-address"
          placeholder="e.g. 123 Main St, Uptown"
          className={uiInput}
          required
        />
        {errors.address?.message && <CommonFormFieldError message={errors.address.message} />}
      </div>
    </div>
  )
}
