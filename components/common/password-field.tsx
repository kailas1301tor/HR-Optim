// components/common/password-field.tsx
'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { uiInput } from '@/lib/ui/design-system'
import { CommonFormFieldError } from './form-field-error'

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
  disabled?: boolean
  error?: string
  placeholder?: string
  required?: boolean
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  disabled = false,
  error,
  placeholder = '••••••••',
  required = false,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="relative flex items-center">
        <Lock className="absolute left-3 h-4 w-4 text-slate-500 z-10" aria-hidden />
        <Input
          id={id}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(uiInput, 'pl-10 pr-10 min-h-11', error && 'border-destructive')}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 text-slate-500 transition-colors hover:text-cloud disabled:opacity-50"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <CommonFormFieldError message={error} />
    </div>
  )
}
