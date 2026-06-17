// components/assets/useReturnAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { returnAssetSchema, type ReturnAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import { employeeService } from '@/services/employee-service'
import type { Department } from '@/types/settings'
import type { Employee } from '@/types/employee'
import type { ReturnAssetTarget } from '@/types/asset'
import { toast } from 'sonner'
import { useAssetEmployeeSearch } from './useAssetEmployeeSearch'

export interface UseReturnAssetDialogReturn {
  departments: Department[]
  employees: Employee[]
  searchQuery: string
  isLoadingDepts: boolean
  isLoadingEmployees: boolean
  isSubmitting: boolean
  returnTarget: ReturnAssetTarget
  setReturnTarget: (target: ReturnAssetTarget) => void
  form: UseFormReturn<ReturnAssetInput>
  selectedEmployeeId: number
  selectedEmp: Employee | undefined
  setSearchQuery: (query: string) => void
  onSubmit: (data: ReturnAssetInput) => Promise<void>
}

export function useReturnAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  onSuccess: () => void
): UseReturnAssetDialogReturn {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingDepts, setIsLoadingDepts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [returnTarget, setReturnTarget] = useState<ReturnAssetTarget>('department')

  const employeeSearchEnabled = open && returnTarget === 'employee'
  const { employees, searchQuery, setSearchQuery, isLoading: isLoadingEmployees } =
    useAssetEmployeeSearch(employeeSearchEnabled)

  const form = useForm<ReturnAssetInput>({
    resolver: zodResolver(returnAssetSchema),
    defaultValues: {
      return_target: 'department',
      return_date: new Date().toISOString().split('T')[0],
      service_cost: 0,
      return_to_department: 0,
    } as ReturnAssetInput,
  })

  const { watch, reset, setValue } = form
  const selectedEmployeeId =
    returnTarget === 'employee' && watch('return_target') === 'employee'
      ? watch('return_to_employee')
      : 0
  const selectedEmp = employees.find((emp) => emp.id === selectedEmployeeId)

  useEffect(() => {
    if (!open) {
      setReturnTarget('department')
      reset({
        return_target: 'department',
        return_date: new Date().toISOString().split('T')[0],
        service_cost: 0,
        return_to_department: 0,
      } as ReturnAssetInput)
      setSearchQuery('')
      return
    }

    const controller = new AbortController()

    async function loadDepts(): Promise<void> {
      setIsLoadingDepts(true)
      try {
        const data = await employeeService.getDepartmentsFromDropdowns(controller.signal)
        if (!controller.signal.aborted) setDepartments(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        toast.error('Failed to load departments')
        setDepartments([])
      } finally {
        if (!controller.signal.aborted) setIsLoadingDepts(false)
      }
    }

    void loadDepts()
    return () => controller.abort()
  }, [open, reset, setSearchQuery])

  const handleSetReturnTarget = (target: ReturnAssetTarget) => {
    setReturnTarget(target)
    setValue('return_target', target, { shouldValidate: true })
    if (target === 'department') {
      setSearchQuery('')
    }
  }

  const onSubmit = async (data: ReturnAssetInput) => {
    setIsSubmitting(true)
    try {
      const base = {
        asset_id: assetId,
        return_date: data.return_date,
        service_cost: data.service_cost,
      }

      if (data.return_target === 'employee') {
        await assetService.returnAsset({
          ...base,
          return_to_employee: data.return_to_employee,
        })
      } else {
        await assetService.returnAsset({
          ...base,
          return_to_department: data.return_to_department,
        })
      }

      toast.success('Asset returned successfully')
      onOpenChange(false)
      reset()
      setReturnTarget('department')
      setSearchQuery('')
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to return asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    departments,
    employees,
    searchQuery,
    isLoadingDepts,
    isLoadingEmployees,
    isSubmitting,
    returnTarget,
    setReturnTarget: handleSetReturnTarget,
    form,
    selectedEmployeeId,
    selectedEmp,
    setSearchQuery,
    onSubmit,
  }
}
