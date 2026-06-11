// components/settings/security-settings.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'
import { CommonCard, CommonPasswordField } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiSectionHeader } from '@/lib/ui/design-system'
import { authService } from '@/services/auth-service'
import { parseAuthErrorPayload } from '@/lib/helpers/parse-auth-form-errors'

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirm_password: 'Passwords do not match' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.changePassword(currentPassword, newPassword, confirmPassword)
      toast.success(response.message || 'Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      const data = error && typeof error === 'object' && 'data' in error ? error.data : undefined
      const parsed = parseAuthErrorPayload(data)
      if (parsed.length > 0) {
        toast.error(parsed.join('. '))
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
          <CommonPasswordField
            id="current-password"
            label="Current Password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
            disabled={isSubmitting}
            required
          />
          <CommonPasswordField
            id="new-password"
            label="New Password"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
            disabled={isSubmitting}
            required
          />
          <CommonPasswordField
            id="confirm-password"
            label="Confirm New Password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isSubmitting}
            error={fieldErrors.confirm_password}
            required
          />
          <PrimaryButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="min-h-11 w-full sm:w-auto"
          >
            Update Password
          </PrimaryButton>
        </form>
      </CommonCard>
    </div>
  )
}
