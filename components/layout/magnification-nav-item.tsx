// components/layout/magnification-nav-item.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { uiSquircleNav, uiSquircleSm } from '@/lib/ui/design-system'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'

const DEFAULT_SPRING: SpringOptions = { mass: 0.1, stiffness: 150, damping: 12 }

interface NavItemTooltipProps {
  label: string
  isHovered: MotionValue<number>
  anchorRef: React.RefObject<HTMLDivElement | null>
}

function NavItemTooltip({ label, isHovered, anchorRef }: NavItemTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1)
      if (latest === 1 && anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect()
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 8,
        })
      }
    })
    return () => unsubscribe()
  }, [isHovered, anchorRef])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.2 }}
          style={{ top: coords.top, left: coords.left }}
          className={cn(
            'pointer-events-none fixed z-[100] w-fit -translate-y-1/2 whitespace-nowrap border border-border bg-card px-2 py-1 text-xs text-cloud shadow-sm',
            uiSquircleSm
          )}
          role="tooltip"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>,
    document.body
  )
}

export interface MagnificationNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  collapsed: boolean
  mouseY: MotionValue<number>
  baseItemSize?: number
  magnification?: number
  distance?: number
  spring?: SpringOptions
}

export function MagnificationNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  collapsed,
  mouseY,
  baseItemSize = 36,
  magnification = 48,
  distance = 100,
  spring = DEFAULT_SPRING,
}: MagnificationNavItemProps) {
  const iconRef = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseY, (val) => {
    const rect = iconRef.current?.getBoundingClientRect() ?? {
      y: 0,
      height: baseItemSize,
    }
    return val - rect.y - baseItemSize / 2
  })

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  )
  const size = useSpring(targetSize, spring)
  const scale = useTransform(size, (s) => s / baseItemSize)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        'relative flex items-center gap-3 h-10 transition-colors duration-150 overflow-visible',
        uiSquircleNav,
        collapsed ? 'justify-center px-0' : 'px-3',
        isActive
          ? 'bg-gradient-to-r from-violet-core to-violet-deep text-white font-medium shadow-md shadow-violet-core/10'
          : 'text-slate-300 hover:bg-carbon hover:text-cloud'
      )}
    >
      <motion.div
        ref={iconRef}
        style={{ width: baseItemSize, height: baseItemSize, scale }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        className={cn('relative inline-flex shrink-0 items-center justify-center', uiSquircleNav)}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            isActive ? 'text-white' : 'text-slate-400'
          )}
        />
        {collapsed && (
          <NavItemTooltip label={label} isHovered={isHovered} anchorRef={iconRef} />
        )}
      </motion.div>

      {!collapsed && <span className="text-sm truncate">{label}</span>}
    </Link>
  )
}
