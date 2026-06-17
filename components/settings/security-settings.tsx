// components/settings/security-settings.tsx
'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'
import { CommonCard, CommonFormFieldError, CommonPasswordField } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiSectionHeader } from '@/lib/ui/design-system'
import { authService } from '@/services/auth-service'
import { parseAuthErrorPayload } from '@/lib/helpers/parse-auth-form-errors'
import { setPasswordSchema } from '@/validations/auth.schema'

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormValid = useMemo(() => {
    if (!currentPassword.trim()) return false
    return setPasswordSchema.safeParse({ password: newPassword, confirmPassword }).success
  }, [currentPassword, newPassword, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    if (!currentPassword.trim()) {
      setFieldErrors({ current_password: 'Current password is required' })
      return
    }

    const parsed = setPasswordSchema.safeParse({ password: newPassword, confirmPassword })
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      setFieldErrors({
        ...(flattened.password?.[0] ? { password: flattened.password[0] } : {}),
        ...(flattened.confirmPassword?.[0] ? { confirm_password: flattened.confirmPassword[0] } : {}),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.changePassword(
        currentPassword,
        parsed.data.password,
        parsed.data.confirmPassword,
      )
      toast.success(response.message || 'Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      const data = error && typeof error === 'object' && 'data' in error ? error.data : undefined
      const parsedErrors = parseAuthErrorPayload(data)
      if (parsedErrors.length > 0) {
        toast.error(parsedErrors.join('. '))
      } else {
        const message = error instanceof Error ? error.message : 'Failed to change password'
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <div>
          <h2 className="text-lg font-semibold text-cloud">Security</h2>
          <p className="text-xs text-muted-foreground mt-1">Update your account password</p>
        </div>
      </div>

      <CommonCard className="max-w-xl p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] [corner-shape:squircle] bg-violet-core/15 ring-1 ring-violet-core/20">
            <Lock className="h-5 w-5 text-violet-glow" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-semibold text-cloud">Change Password</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your current password and choose a new one.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <CommonPasswordField
              id="current-password"
              label="Current Password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(value) => {
                setCurrentPassword(value)
                if (fieldErrors.current_password) {
                  setFieldErrors((prev) => ({ ...prev, current_password: '' }))
                }
              }}
              disabled={isSubmitting}
              required
            />
            <CommonFormFieldError message={fieldErrors.current_password} />
          </div>
          <div className="space-y-1">
            <CommonPasswordField
              id="new-password"
              label="New Password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value)
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: '' }))
                }
              }}
              disabled={isSubmitting}
              required
            />
            <CommonFormFieldError message={fieldErrors.password} />
          </div>
          <CommonPasswordField
            id="confirm-password"
            label="Confirm New Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value)
              if (fieldErrors.confirm_password) {
                setFieldErrors((prev) => ({ ...prev, confirm_password: '' }))
              }
            }}
            disabled={isSubmitting}
            error={fieldErrors.confirm_password}
            required
          />
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || !isFormValid}
            className="min-h-11 w-full sm:w-auto"
          >
            Update Password
          </PrimaryButton>
        </form>
      </CommonCard>
    </div>
  )
}
