// components/common/form-field-error.tsx
import { cn } from '@/lib/utils'

interface CommonFormFieldErrorProps {
  message?: string
  className?: string
}

export function CommonFormFieldError({ message, className }: CommonFormFieldErrorProps) {
  if (!message) return null
  return (
    <p className={cn('text-[11px] text-destructive font-medium', className)} role="alert">
      {message}
    </p>
  )
}
