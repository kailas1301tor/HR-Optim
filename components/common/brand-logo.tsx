// components/common/brand-logo.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  APP_MARK_ALT,
  APP_MARK_PATH,
  COMPANY_TAGLINE,
  PRODUCT_NAME,
} from '@/lib/brand'
import { uiBrandMark } from '@/lib/ui/design-system'

const markSizeClasses = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
} as const

const markSizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
} as const

const fullTitleClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const

const fullTaglineClasses = {
  sm: 'text-[9px] tracking-[0.14em]',
  md: 'text-[10px] tracking-[0.16em]',
  lg: 'text-[11px] tracking-[0.18em]',
  xl: 'text-xs tracking-[0.2em]',
} as const

const fullGapClasses = {
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-2.5',
  xl: 'gap-3',
} as const

interface BrandMarkImageProps {
  size: 'sm' | 'md' | 'lg' | 'xl'
  priority?: boolean
  className?: string
}

function BrandMarkImage({ size, priority = false, className }: BrandMarkImageProps) {
  const pixelSize = markSizePixels[size]

  return (
    <div className={cn(uiBrandMark, markSizeClasses[size], className)}>
      <Image
        src={APP_MARK_PATH}
        alt={APP_MARK_ALT}
        fill
        priority={priority}
        sizes={`${pixelSize}px`}
        className="object-cover"
      />
    </div>
  )
}

interface BrandLogoProps {
  variant?: 'full' | 'mark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  className?: string
  priority?: boolean
}

export function BrandLogo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className,
  priority = false,
}: BrandLogoProps) {
  if (variant === 'mark') {
    return <BrandMarkImage size={size} priority={priority} className={className} />
  }

  return (
    <div className={cn('flex items-center min-w-0', fullGapClasses[size], className)}>
      <BrandMarkImage size={size} priority={priority} />
      <div className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className={cn(
            'truncate font-bold uppercase tracking-tight text-foreground',
            fullTitleClasses[size],
          )}
        >
          {PRODUCT_NAME.toUpperCase()}
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1 truncate font-medium uppercase text-muted-foreground',
              fullTaglineClasses[size],
            )}
          >
            {COMPANY_TAGLINE}
          </span>
        ) : null}
      </div>
    </div>
  )
}
