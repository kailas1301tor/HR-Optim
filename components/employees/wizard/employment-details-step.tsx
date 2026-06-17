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

interface EmploymentDetailsStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function EmploymentDetailsStep({ isEditMode = false, dropdowns }: EmploymentDetailsStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentEmployeeType = watch('employee_type')
  const currentAccommodation = watch('accommodation')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Employment Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-joined-date" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Joined Date
          </Label>
          <Input
            {...register('joined_date')}
            id="emp-joined-date"
            type="date"
            className={cn(uiInput, 'text-slate-300')}
            required
          />
          {errors.joined_date?.message && <CommonFormFieldError message={errors.joined_date.message} />}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Employee Type
          </Label>
          <Select
            value={currentEmployeeType || undefined}
            onValueChange={(val) => setValue('employee_type', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.employee_types.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employee_type?.message && <CommonFormFieldError message={errors.employee_type.message} />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-basic-salary" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Basic Salary (USD)
          </Label>
          <Input
            {...register('basic_salary')}
            id="emp-basic-salary"
            type="number"
            step="0.01"
            placeholder="e.g. 5000.00"
            className={uiInput}
            required
          />
          {errors.basic_salary?.message && <CommonFormFieldError message={errors.basic_salary.message} />}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Accommodation
          </Label>
          <Select
            value={currentAccommodation || undefined}
            onValueChange={(val) => setValue('accommodation', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.accommodation_choices.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accommodation?.message && <CommonFormFieldError message={errors.accommodation.message} />}
        </div>
      </div>
    </div>
  )
}
