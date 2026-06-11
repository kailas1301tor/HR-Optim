// components/assets/useAssignAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assignAssetSchema, type AssignAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import type { Employee } from '@/types/employee'
import { toast } from 'sonner'
import { useAssetEmployeeSearch } from './useAssetEmployeeSearch'

export interface UseAssignAssetDialogReturn {
  employees: Employee[]
  searchQuery: string
  isLoadingEmployees: boolean
  isSubmitting: boolean
  form: UseFormReturn<AssignAssetInput>
  selectedEmployeeId: number
  selectedEmp: Employee | undefined
  setSearchQuery: (query: string) => void
  onSubmit: (data: AssignAssetInput) => Promise<void>
}

export function useAssignAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  onSuccess: () => void
): UseAssignAssetDialogReturn {
  const { employees, searchQuery, setSearchQuery, isLoading: isLoadingEmployees } =
    useAssetEmployeeSearch(open)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssignAssetInput>({
    resolver: zodResolver(assignAssetSchema),
    defaultValues: {
      remarks: '',
    },
  })

  const { watch, reset } = form
  const selectedEmployeeId = watch('assign_to_employee')
  const selectedEmp = employees.find((emp) => emp.id === selectedEmployeeId)

  useEffect(() => {
    if (!open) {
      reset({ remarks: '' })
      setSearchQuery('')
    }
  }, [open, reset, setSearchQuery])

  const onSubmit = async (data: AssignAssetInput) => {
    setIsSubmitting(true)
    try {
      await assetService.assignAsset({
        asset_id: assetId,
        assign_to_employee: data.assign_to_employee,
        remarks: data.remarks,
      })
      toast.success('Asset assigned successfully')
      onOpenChange(false)
      reset()
      setSearchQuery('')
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    employees,
    searchQuery,
    isLoadingEmployees,
    isSubmitting,
    form,
    selectedEmployeeId,
    selectedEmp,
    setSearchQuery,
    onSubmit,
  }
}
