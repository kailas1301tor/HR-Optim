// components/assets/useAddAssetModal.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { assetSchema, type AssetInput } from '@/validations/asset.schema'
import { assetService } from '@/services/asset-service'
import {
  assetToFormValues,
  defaultAssetFormValues,
  formValuesToPayload,
} from '@/lib/mappers/asset-mapper'
import type { Asset, AssetDropdowns } from '@/types/asset'
import type { Department } from '@/types/settings'
import { invalidateAssetDropdowns } from './useAssetDropdowns'

export interface UseAddAssetModalReturn {
  isSubmitting: boolean
  form: UseFormReturn<AssetInput>
  onSubmit: (data: AssetInput) => Promise<void>
}

export function useAddAssetModal(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void,
  editAsset: Asset | null | undefined,
  dropdowns: AssetDropdowns | null,
  departments: Department[]
): UseAddAssetModalReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    mode: 'onBlur',
  })

  const { reset } = form

  useEffect(() => {
    if (!open) return
    if (editAsset && dropdowns) {
      reset(assetToFormValues(editAsset, dropdowns, departments))
    } else {
      reset(defaultAssetFormValues())
    }
  }, [open, editAsset, dropdowns, departments, reset])

  const onSubmit = async (data: AssetInput) => {
    setIsSubmitting(true)
    try {
      const payload = formValuesToPayload(data)

      if (editAsset) {
        await assetService.updateAsset({ ...payload, id: editAsset.id })
        toast.success('Asset updated successfully')
      } else {
        await assetService.createAsset(payload)
        toast.success('Asset added successfully')
      }
      invalidateAssetDropdowns()
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during submission'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    form,
    onSubmit,
  }
}
