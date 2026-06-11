// components/login/set-password-dialog.tsx
'use client'

import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PrimaryButton } from '@/components/ui/primary-button'
import { CommonFormFieldError } from '@/components/common'
import { uiDialog, uiInput } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { useSetPasswordDialog } from './useSetPasswordDialog'

interface SetPasswordDialogProps {
  open: boolean
  authToken: string | null
  onSuccess: () => void | Promise<void>
}

export function SetPasswordDialog({ open, authToken, onSuccess }: SetPasswordDialogProps) {
  const {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmitting,
    handleSubmit,
  } = useSetPasswordDialog({ authToken, onSuccess })

  const { register, formState: { errors } } = form

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className={cn(uiDialog, 'max-w-md md:max-w-lg p-6')}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-[20px] [corner-shape:squircle] bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shadow-lg shadow-violet-core/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-cloud font-sans">
            Create Your Password
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-sans max-w-xs">
            This is your first login. For security, set a password with uppercase and a special character.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
              <Input
                {...register('password')}
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={cn(uiInput, 'pl-10 pr-10 min-h-11', errors.password && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-slate-500 hover:text-cloud transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <CommonFormFieldError message={errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm Password
            </Label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
              <Input
                {...register('confirmPassword')}
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className={cn(uiInput, 'pl-10 pr-10 min-h-11', errors.confirmPassword && 'border-destructive')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 text-slate-500 hover:text-cloud transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <CommonFormFieldError message={errors.confirmPassword?.message} />
          </div>

          <DialogFooter className="pt-2">
            <PrimaryButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full min-h-11 font-semibold"
            >
              {isSubmitting ? 'Saving Password...' : 'Confirm & Setup Account'}
            </PrimaryButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
