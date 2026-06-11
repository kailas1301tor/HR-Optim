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
import { uiInput, uiSelect } from '@/lib/ui/design-system'
import type { EmployeeInput } from '@/validations/employee.schema'
import type { DropdownData } from '@/types/employee'

interface BasicInfoStepProps {
  isEditMode?: boolean
  dropdowns: DropdownData | null
}

export function BasicInfoStep({ isEditMode = false, dropdowns }: BasicInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EmployeeInput>()

  const currentRole = watch('role')
  const currentDepartment = watch('department')
  const currentDesignation = watch('designation')
  const currentStatus = watch('status')
  const currentShift = watch('shift')

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border/40">
        <h3 className="text-sm font-semibold text-cloud">Basic Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-full-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Full Name
          </Label>
          <Input
            {...register('full_name')}
            id="emp-full-name"
            placeholder="Enter Full Name"
            className={uiInput}
            required
          />
          {errors.full_name?.message && <CommonFormFieldError message={errors.full_name.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-username" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Username
          </Label>
          <Input
            {...register('username')}
            id="emp-username"
            placeholder="e.g. johndoe"
            className={uiInput}
            required
            disabled={isEditMode}
            autoComplete="off"
          />
          {errors.username?.message && <CommonFormFieldError message={errors.username.message} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emp-email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </Label>
        <Input
          {...register('email')}
          id="emp-email"
          type="email"
          placeholder="name@company.com"
          className={uiInput}
          required
          autoComplete="off"
        />
        {errors.email?.message && <CommonFormFieldError message={errors.email.message} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emp-phone" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Phone Number
          </Label>
          <Input
            {...register('phone_number')}
            id="emp-phone"
            placeholder="e.g. 1234567890"
            className={uiInput}
            required
          />
          {errors.phone_number?.message && <CommonFormFieldError message={errors.phone_number.message} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-id" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Employee ID
          </Label>
          <Input
            {...register('employee_id')}
            id="emp-id"
            placeholder="e.g. EMP001"
            className={uiInput}
            required
            disabled={isEditMode}
          />
          {errors.employee_id?.message && <CommonFormFieldError message={errors.employee_id.message} />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Role
          </Label>
          <Select
            value={currentRole || undefined}
            onValueChange={(val) => setValue('role', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.roles.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role?.message && <CommonFormFieldError message={errors.role.message} />}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Department
          </Label>
          <Select
            value={currentDepartment || undefined}
            onValueChange={(val) => {
              setValue('department', val)
              const validDesignations = dropdowns?.designations.filter(
                (item) => !item.department_id || String(item.department_id) === val
              )
              const designationStillValid = validDesignations?.some(
                (item) => String(item.id) === currentDesignation
              )
              if (!designationStillValid && validDesignations?.[0]) {
                setValue('designation', String(validDesignations[0].id))
              }
            }}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.departments.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department?.message && <CommonFormFieldError message={errors.department.message} />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Designation
          </Label>
          <Select
            value={currentDesignation || undefined}
            onValueChange={(val) => setValue('designation', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.designations
                .filter((item) => !currentDepartment || !item.department_id || String(item.department_id) === currentDepartment)
                .map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.designation?.message && <CommonFormFieldError message={errors.designation.message} />}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status
          </Label>
          <Select
            value={currentStatus || undefined}
            onValueChange={(val) => setValue('status', val)}
          >
            <SelectTrigger className={uiSelect}>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {dropdowns?.status_choices.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status?.message && <CommonFormFieldError message={errors.status.message} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Shift
        </Label>
        <Select
          value={currentShift || undefined}
          onValueChange={(val) => setValue('shift', val)}
        >
          <SelectTrigger className={uiSelect}>
            <SelectValue placeholder="Select Shift" />
          </SelectTrigger>
          <SelectContent>
            {dropdowns?.shifts.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.shift?.message && <CommonFormFieldError message={errors.shift.message} />}
      </div>
    </div>
  )
}
