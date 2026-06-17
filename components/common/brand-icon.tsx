import Image from 'next/image'
import { cn } from '@/lib/utils'
import { APP_ICON_ALT, APP_ICON_PATH } from '@/lib/brand'

const sizeClasses = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-16',
} as const

const sizePixels = {
  sm: 32,
  md: 48,
  lg: 64,
} as const

/** Matches app-icon corner radius (~22% of edge length). */
const iconRadiusClass = 'rounded-[22%] [corner-shape:squircle]'

interface BrandIconProps {
  size?: keyof typeof sizeClasses
  className?: string
  priority?: boolean
}

export function BrandIcon({ size = 'md', className, priority = false }: BrandIconProps) {
  const pixelSize = sizePixels[size]

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-black',
        iconRadiusClass,
        sizeClasses[size],
        className,
      )}
    >
      <Image
        src={APP_ICON_PATH}
        alt={APP_ICON_ALT}
        fill
        priority={priority}
        sizes={`${pixelSize}px`}
        className="object-cover"
      />
    </div>
  )
}
