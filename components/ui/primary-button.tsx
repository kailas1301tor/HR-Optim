// components/ui/primary-button.tsx
import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiPrimaryBtn } from '@/lib/ui/design-system'

interface PrimaryButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean
}

export function PrimaryButton({
  className,
  children,
  isLoading = false,
  disabled,
  asChild = false,
  ...props
}: PrimaryButtonProps) {
  // Radix Slot (asChild) requires exactly one React element child — never add Loader2 as a sibling.
  if (asChild) {
    return (
      <Button
        className={cn(uiPrimaryBtn, 'gap-2', className)}
        disabled={disabled || isLoading}
        asChild
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      className={cn(uiPrimaryBtn, 'gap-2', className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  )
}
