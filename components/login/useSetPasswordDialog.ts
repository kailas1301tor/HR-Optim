// components/login/useSetPasswordDialog.ts
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authService } from '@/services/auth-service'
import { setPasswordSchema, type SetPasswordValues } from '@/validations/auth.schema'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { applyAuthFieldErrors } from '@/lib/helpers/parse-auth-form-errors'
import { ApiError } from '@/lib/api'
import type { FieldPath } from 'react-hook-form'

const SET_PASSWORD_FIELD_MAP: Partial<Record<string, FieldPath<SetPasswordValues>>> = {
  new_password: 'password',
  confirm_new_password: 'confirmPassword',
}

interface UseSetPasswordDialogOptions {
  authToken: string | null
  onSuccess: () => void | Promise<void>
}

export function useSetPasswordDialog({ authToken, onSuccess }: UseSetPasswordDialogOptions) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await authService.setPassword(data.password, data.confirmPassword, authToken ?? undefined)
      toast.success('Password set successfully!', {
        description: 'Your account is now secure. Redirecting to your dashboard...',
      })
      await onSuccess()
    } catch (error: unknown) {
      const errorData = error instanceof ApiError ? error.data : undefined
      applyAuthFieldErrors<SetPasswordValues>(errorData, form.setError, SET_PASSWORD_FIELD_MAP)
      const errorMessage = getApiErrorMessage(error, 'Failed to set password.')
      toast.error('Error setting password', { description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    handleSubmit,
  }
}
