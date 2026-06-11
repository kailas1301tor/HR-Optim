// components/layout/sidebar-magnification-nav.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '@/components/auth/permissions-provider'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { SIDEBAR_NAV_ITEMS, SIDEBAR_SECTIONS } from './sidebar-nav-config'
import { MagnificationNavItem } from './magnification-nav-item'

const MAGNIFICATION_SPRING = { mass: 0.1, stiffness: 150, damping: 12 }

interface SidebarMagnificationNavProps {
  collapsed: boolean
  isMobile: boolean
  pathname: string
}

function SidebarStaticNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  showLabel,
}: {
  href: string
  icon: (typeof SIDEBAR_NAV_ITEMS)[number]['icon']
  label: string
  isActive: boolean
  showLabel: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 h-10 px-3 rounded-[16px] [corner-shape:squircle] transition-all duration-150',
        isActive
          ? 'bg-gradient-to-r from-violet-core to-violet-deep text-white font-medium shadow-md shadow-violet-core/10'
          : 'text-slate-300 hover:bg-carbon hover:text-cloud'
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="text-sm truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}

export function SidebarMagnificationNav({
  collapsed,
  isMobile,
  pathname,
}: SidebarMagnificationNavProps) {
  const mouseY = useMotionValue(Infinity)
  const showSectionHeaders = !collapsed || isMobile
  const showLabels = !collapsed || isMobile
  const { isLoading, canView } = usePermissions()

  const visibleItems = SIDEBAR_NAV_ITEMS.filter((item) => canView(item.moduleKey))

  if (isLoading) {
    return (
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4" aria-label="Loading navigation">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section} className="space-y-2">
            {showSectionHeaders && (
              <Skeleton className={cn('h-3 w-16 ml-3', uiSkeletonBlock)} />
            )}
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton
                key={`${section}-${index}`}
                className={cn('h-10 w-full rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)}
              />
            ))}
          </div>
        ))}
      </nav>
    )
  }

  return (
    <nav
      className="flex-1 overflow-y-auto overflow-x-visible py-4 px-3 custom-scrollbar"
      onMouseMove={
        !isMobile
          ? ({ pageY }) => {
              mouseY.set(pageY)
            }
          : undefined
      }
      onMouseLeave={
        !isMobile
          ? () => {
              mouseY.set(Infinity)
            }
          : undefined
      }
    >
      {SIDEBAR_SECTIONS.map((section) => {
        const sectionItems = visibleItems.filter((item) => item.section === section)
        if (sectionItems.length === 0) return null

        return (
        <div key={section} className="mb-6">
          <AnimatePresence>
            {showSectionHeaders && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                {section}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="space-y-1">
            {sectionItems.map((item) => {
              const isActive = pathname === item.href

              if (isMobile) {
                return (
                  <SidebarStaticNavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                    showLabel={showLabels}
                  />
                )
              }

              return (
                <MagnificationNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                  collapsed={collapsed}
                  mouseY={mouseY}
                  baseItemSize={36}
                  magnification={48}
                  distance={100}
                  spring={MAGNIFICATION_SPRING}
                />
              )
            })}
          </div>
        </div>
        )
      })}
    </nav>
  )
}
