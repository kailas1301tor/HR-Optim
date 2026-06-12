// components/assets/useTransferAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transferAssetSchema, type TransferAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import { employeeService } from '@/services/employee-service'
import type { Department } from '@/types/settings'
import { toast } from 'sonner'

export interface UseTransferAssetDialogReturn {
  departments: Department[]
  isLoadingDepts: boolean
  isSubmitting: boolean
  form: UseFormReturn<TransferAssetInput>
  onSubmit: (data: TransferAssetInput) => Promise<void>
}

export function useTransferAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  onSuccess: () => void
): UseTransferAssetDialogReturn {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingDepts, setIsLoadingDepts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransferAssetInput>({
    resolver: zodResolver(transferAssetSchema),
    defaultValues: {
      remarks: ''
    }
  })

  const { reset } = form

  useEffect(() => {
    if (!open) {
      reset({ remarks: '' })
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
  }, [open, reset])

  const onSubmit = async (data: TransferAssetInput) => {
    setIsSubmitting(true)
    try {
      await assetService.transferAsset({
        asset_id: assetId,
        transfer_to_department: data.transfer_to_department,
        remarks: data.remarks
      })
      toast.success('Asset transferred successfully')
      onOpenChange(false)
      reset()
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to transfer asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    departments,
    isLoadingDepts,
    isSubmitting,
    form,
    onSubmit,
  }
}
