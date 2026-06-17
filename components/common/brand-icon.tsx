// components/common/brand-icon.tsx
import { BrandLogo } from './brand-logo'

interface BrandIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  priority?: boolean
}

/** @deprecated Use BrandLogo with variant="mark" */
export function BrandIcon({ size = 'md', className, priority = false }: BrandIconProps) {
  return <BrandLogo variant="mark" size={size} className={className} priority={priority} />
}
