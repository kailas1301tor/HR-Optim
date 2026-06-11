// components/assets/useMaintenanceDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceSchema, type MaintenanceInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import type { AssetDropdowns } from '@/types/asset'
import { toast } from 'sonner'

export interface UseMaintenanceDialogReturn {
  isSubmitting: boolean
  serviceTypes: Array<{ id: number; name: string }>
  providers: Array<{ id: number; name: string }>
  form: UseFormReturn<MaintenanceInput>
  onSubmit: (data: MaintenanceInput) => Promise<void>
}

export function useMaintenanceDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  dropdowns: AssetDropdowns | null,
  onSuccess: () => void
): UseMaintenanceDialogReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const serviceTypes = dropdowns?.service_types || []
  const providers = dropdowns?.maintenance_shops || []

  const form = useForm<MaintenanceInput>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      estimated_cost: 0
    }
  })

  const { reset } = form

  useEffect(() => {
    if (!open) {
      reset({ estimated_cost: 0 })
    }
  }, [open, reset])

  const onSubmit = async (data: MaintenanceInput) => {
    setIsSubmitting(true)
    try {
      await assetService.scheduleMaintenance({
        asset_id: assetId,
        service_type: data.service_type,
        service_provider: data.service_provider,
        estimated_cost: data.estimated_cost
      })
      toast.success('Maintenance scheduled successfully')
      onOpenChange(false)
      reset()
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to schedule maintenance'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    serviceTypes,
    providers,
    form,
    onSubmit,
  }
}
