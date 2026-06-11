// components/employees/useAddEmployeeModal.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bankDetailsService } from '@/services/bank-details-service'
import { employeeService } from '@/services/employee-service'
import { employeeSchema, type EmployeeInput } from '@/validations/employee.schema'
import type { Employee } from '@/types/employee'
import {
  defaultFormValues,
  employeeToFormValues,
  formValuesToPayload,
} from '@/lib/mappers/employee-form-mapper'
import { toast } from 'sonner'
import { useEmployeeDropdowns } from './useEmployeeDropdowns'

const EMPTY_DEFAULTS: EmployeeInput = {
  id: '',
  username: '',
  email: '',
  full_name: '',
  phone_number: '',
  role: '',
  department: '',
  designation: '',
  employee_id: '',
  status: 'Active',
  shift: '',
  joined_date: '',
  employee_type: '',
  basic_salary: '',
  accommodation: '',
  date_of_birth: '',
  nationality: '',
  address: '',
  bank_name: '',
  account_number: '',
  ifsc: '',
  branch: '',
}

export interface UseAddEmployeeModalReturn {
  addStep: number
  isLoading: boolean
  dropdowns: ReturnType<typeof useEmployeeDropdowns>['dropdowns']
  isEditMode: boolean
  methods: UseFormReturn<EmployeeInput>
  setAddStep: (step: number) => void
  onSubmit: (data: EmployeeInput) => Promise<void>
  handleNextStep: (e: React.MouseEvent) => Promise<void>
}

export function useAddEmployeeModal(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: (employee: Employee) => void,
  editEmployee: Employee | null | undefined
): UseAddEmployeeModalReturn {
  const [addStep, setAddStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { dropdowns, isLoading: dropdownsLoading } = useEmployeeDropdowns()
  const isEditMode = !!editEmployee

  const methods = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  const { reset } = methods

  useEffect(() => {
    if (!open || !dropdowns) return
    setAddStep(1)
    if (editEmployee) {
      reset(employeeToFormValues(editEmployee, dropdowns))
    } else {
      reset(defaultFormValues(dropdowns))
    }
  }, [open, dropdowns, editEmployee, reset])

  const onSubmit = async (data: EmployeeInput) => {
    setIsSubmitting(true)
    try {
      const payload = formValuesToPayload(data)

      let savedEmployee: Employee
      if (isEditMode && editEmployee) {
        savedEmployee = await employeeService.updateEmployee({ ...payload, id: Number(editEmployee.id) })
        toast.success('Employee updated successfully')
      } else {
        savedEmployee = await employeeService.createEmployee(payload)
        toast.success('Employee created successfully')
      }

      const employeeId = Number(savedEmployee.id)
      const bankRecords = await bankDetailsService.list()
      const existingBankId = bankRecords.find((record) => record.employee === employeeId)?.id
      await bankDetailsService.upsertForEmployee(
        employeeId,
        {
          bank_name: data.bank_name,
          account_number: data.account_number,
          ifsc: data.ifsc,
          branch: data.branch,
        },
        existingBankId,
      )

      onSuccess(savedEmployee)
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Validation error'
      toast.error(isEditMode ? 'Failed to update employee' : 'Failed to create employee', {
        description: msg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    const fields = [
      ['full_name', 'username', 'email', 'phone_number', 'employee_id', 'role', 'department', 'designation', 'status', 'shift'],
      ['basic_salary', 'joined_date', 'employee_type', 'accommodation'],
      ['date_of_birth', 'nationality', 'address'],
    ][addStep - 1]

    if (fields) {
      const fieldsToValidate = fields as Path<EmployeeInput>[]
      const isValid = await methods.trigger(fieldsToValidate)
      if (!isValid) return
    }
    setAddStep(addStep + 1)
  }

  return {
    addStep,
    isLoading: dropdownsLoading || isSubmitting,
    dropdowns,
    isEditMode,
    methods,
    setAddStep,
    onSubmit,
    handleNextStep,
  }
}
