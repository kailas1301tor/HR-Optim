// components/common/brand-logo.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  APP_LOGO_ALT,
  APP_LOGO_DARK_PATH,
  APP_LOGO_LIGHT_PATH,
  APP_MARK_ALT,
  APP_MARK_DARK_PATH,
  APP_MARK_LIGHT_PATH,
  COMPANY_TAGLINE,
} from '@/lib/brand'

type BrandLogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero'

const markSizeClasses: Record<Exclude<BrandLogoSize, 'hero'>, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
}

const markSizePixels: Record<Exclude<BrandLogoSize, 'hero'>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
}

const fullHeightClasses: Record<BrandLogoSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14',
  hero: 'h-24 sm:h-28 lg:h-32 xl:h-36',
}

const fullTaglineClasses: Record<Exclude<BrandLogoSize, 'hero'>, string> = {
  sm: 'text-[9px] tracking-[0.14em]',
  md: 'text-[10px] tracking-[0.16em]',
  lg: 'text-[11px] tracking-[0.18em]',
  xl: 'text-xs tracking-[0.2em]',
}

interface ThemeImagePairProps {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
  width: number
  height: number
  sizes: string
  priority?: boolean
}

function ThemeImagePair({
  lightSrc,
  darkSrc,
  alt,
  className,
  width,
  height,
  sizes,
  priority = false,
}: ThemeImagePairProps) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn(className, 'dark:hidden')}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={cn(className, 'hidden dark:block')}
      />
    </>
  )
}

interface BrandMarkImageProps {
  size: Exclude<BrandLogoSize, 'hero'>
  priority?: boolean
  className?: string
}

function BrandMarkImage({ size, priority = false, className }: BrandMarkImageProps) {
  const pixelSize = markSizePixels[size]

  return (
    <div className={cn('relative shrink-0', markSizeClasses[size], className)}>
      <ThemeImagePair
        lightSrc={APP_MARK_LIGHT_PATH}
        darkSrc={APP_MARK_DARK_PATH}
        alt={APP_MARK_ALT}
        width={pixelSize}
        height={pixelSize}
        sizes={`${pixelSize}px`}
        priority={priority}
        className="absolute inset-0 size-full object-contain"
      />
    </div>
  )
}

interface BrandFullWordmarkProps {
  size: BrandLogoSize
  showTagline?: boolean
  priority?: boolean
  className?: string
}

function BrandFullWordmark({
  size,
  showTagline = false,
  priority = false,
  className,
}: BrandFullWordmarkProps) {
  const heightClass = fullHeightClasses[size]
  const imageSizes =
    size === 'hero'
      ? '(max-width: 1024px) 280px, 360px'
      : '(max-width: 768px) 120px, 160px'

  return (
    <div className={cn('flex min-w-0 flex-col items-start', className)}>
      <div className={cn('relative w-fit max-w-full', heightClass)}>
        <ThemeImagePair
          lightSrc={APP_LOGO_LIGHT_PATH}
          darkSrc={APP_LOGO_DARK_PATH}
          alt={APP_LOGO_ALT}
          width={1024}
          height={512}
          sizes={imageSizes}
          priority={priority}
          className="h-full w-auto max-w-full object-contain object-left"
        />
      </div>
      {showTagline && size !== 'hero' ? (
        <span
          className={cn(
            'mt-1.5 truncate font-medium uppercase text-muted-foreground',
            fullTaglineClasses[size],
          )}
        >
          {COMPANY_TAGLINE}
        </span>
      ) : null}
    </div>
  )
}

interface BrandLogoProps {
  variant?: 'full' | 'mark'
  size?: BrandLogoSize
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
    const markSize = size === 'hero' ? 'xl' : size
    return <BrandMarkImage size={markSize} priority={priority} className={className} />
  }

  return (
    <BrandFullWordmark
      size={size}
      showTagline={showTagline}
      priority={priority}
      className={className}
    />
  )
}
