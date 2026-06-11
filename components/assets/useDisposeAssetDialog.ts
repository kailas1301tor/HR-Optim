// components/assets/useDisposeAssetDialog.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { disposeAssetSchema, type DisposeAssetInput } from '@/validations/asset-actions.schema'
import { assetService } from '@/services/asset-service'
import type { AssetDropdowns } from '@/types/asset'
import { toast } from 'sonner'

export interface UseDisposeAssetDialogReturn {
  isSubmitting: boolean
  disposalChoices: { id: string; name: string }[]
  hasDisposalChoicesError: boolean
  form: UseFormReturn<DisposeAssetInput>
  onSubmit: (data: DisposeAssetInput) => Promise<void>
}

export function useDisposeAssetDialog(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  assetId: number,
  dropdowns: AssetDropdowns | null,
  onSuccess: () => void
): UseDisposeAssetDialogReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const disposalChoices = dropdowns?.disposal_choices ?? []
  const hasDisposalChoicesError = open && disposalChoices.length === 0

  const form = useForm<DisposeAssetInput>({
    resolver: zodResolver(disposeAssetSchema),
    defaultValues: {
      disposal_date: new Date().toISOString().split('T')[0],
      disposal_value: 0,
    },
  })

  const { reset } = form

  useEffect(() => {
    if (!open) {
      reset({
        disposal_date: new Date().toISOString().split('T')[0],
        disposal_value: 0,
      })
    }
  }, [open, reset])

  const onSubmit = async (data: DisposeAssetInput) => {
    if (hasDisposalChoicesError) {
      toast.error('Disposal methods are unavailable. Please try again later.')
      return
    }
    setIsSubmitting(true)
    try {
      await assetService.disposeAsset({
        asset: assetId,
        disposal_date: data.disposal_date,
        disposal_method: data.disposal_method,
        disposal_value: data.disposal_value,
      })
      toast.success('Asset disposed successfully')
      onOpenChange(false)
      reset()
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to dispose asset'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    disposalChoices,
    hasDisposalChoicesError,
    form,
    onSubmit,
  }
}
