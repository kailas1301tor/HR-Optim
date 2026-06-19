import { useFormContext, Controller } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
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
import { DatePicker } from '@/components/ui/date-picker'
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
    control,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentEmployeeType = watch('employee_type')
  const currentAccommodation = watch('accommodation')
  const joinedDate = watch('joined_date')

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
          <DatePicker
            id="emp-joined-date"
            value={joinedDate}
            onChange={(val) => setValue('joined_date', val, { shouldValidate: true })}
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

      <div className="flex items-center justify-between p-3.5 bg-midnight/40 border border-border/50 rounded-[20px] [corner-shape:squircle] mt-2">
        <div className="space-y-0.5">
          <Label htmlFor="emp-is-tl" className="text-sm font-semibold text-slate-200 cursor-pointer">
            Team Lead Status
          </Label>
          <p className="text-xs text-muted-foreground">
            Designate this employee as a Team Lead (TL)
          </p>
        </div>
        <Controller
          control={control}
          name="is_tl"
          render={({ field }) => (
            <Switch
              id="emp-is-tl"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between p-3.5 bg-midnight/40 border border-border/50 rounded-[20px] [corner-shape:squircle]">
        <div className="space-y-0.5">
          <Label htmlFor="emp-manual-attendance" className="text-sm font-semibold text-slate-200 cursor-pointer">
            Manual Attendance
          </Label>
          <p className="text-xs text-muted-foreground">
            Allow this employee to check in and out from the dashboard
          </p>
        </div>
        <Controller
          control={control}
          name="is_manual_attendance_enabled"
          render={({ field }) => (
            <Switch
              id="emp-manual-attendance"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  )
}
