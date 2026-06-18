// components/common/self-service-module-tabs.tsx
'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface SelfServiceModuleTabsProps {
  teamLabel?: string
  mineLabel?: string
  defaultTab?: 'team' | 'mine'
  showAdminView: boolean
  showPersonalView: boolean
  teamContent: ReactNode
  mineContent: ReactNode
  className?: string
}

const tabTriggerClass = cn(
  'group relative z-10 h-auto w-auto shrink-0 flex-none rounded-sm border-0 bg-transparent px-2 pb-2.5 pt-1 text-sm font-medium shadow-none',
  'text-muted-foreground transition-[color,transform] duration-200 ease-out',
  'hover:text-violet-glow/90 hover:-translate-y-px',
  'data-[state=active]:bg-transparent data-[state=active]:border-transparent data-[state=active]:text-cloud data-[state=active]:shadow-none',
  'data-[state=active]:font-semibold data-[state=active]:translate-y-0',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

const contentMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
}

interface AnimatedTabTriggerProps {
  value: 'team' | 'mine'
  activeTab: 'team' | 'mine'
  children: ReactNode
}

function AnimatedTabTrigger({ value, activeTab, children }: AnimatedTabTriggerProps) {
  const isActive = activeTab === value

  return (
    <TabsTrigger value={value} className={tabTriggerClass}>
      <span className="relative z-10">{children}</span>
      {isActive ? (
        <motion.span
          layoutId="self-service-tab-underline"
          className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-gradient-to-r from-violet-core via-violet-glow to-violet-core shadow-[0_0_12px_rgba(139,92,246,0.45)]"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          aria-hidden
        />
      ) : null}
      {!isActive ? (
        <span
          className="pointer-events-none absolute bottom-0 left-1 right-1 h-[2px] scale-x-0 rounded-full bg-violet-glow/35 transition-transform duration-200 ease-out group-hover:scale-x-75"
          aria-hidden
        />
      ) : null}
    </TabsTrigger>
  )
}

export function SelfServiceModuleTabs({
  teamLabel = 'Team',
  mineLabel = 'Mine',
  defaultTab = 'team',
  showAdminView,
  showPersonalView,
  teamContent,
  mineContent,
  className,
}: SelfServiceModuleTabsProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'mine'>(defaultTab)

  if (!showAdminView && showPersonalView) {
    return <div className={className}>{mineContent}</div>
  }

  if (showAdminView && !showPersonalView) {
    return <div className={className}>{teamContent}</div>
  }

  if (!showAdminView && !showPersonalView) {
    return null
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'team' | 'mine')}
      className={cn('space-y-6', className)}
    >
      <div className="border-b border-border/40">
        <TabsList
          className="inline-flex h-auto w-fit max-w-full items-end justify-start gap-8 rounded-none bg-transparent p-0 shadow-none"
          aria-label="View scope"
        >
          <AnimatedTabTrigger value="team" activeTab={activeTab}>
            {teamLabel}
          </AnimatedTabTrigger>
          <AnimatedTabTrigger value="mine" activeTab={activeTab}>
            {mineLabel}
          </AnimatedTabTrigger>
        </TabsList>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'team' ? (
          <motion.div key="team" className="outline-none" {...contentMotion}>
            {teamContent}
          </motion.div>
        ) : (
          <motion.div key="mine" className="outline-none" {...contentMotion}>
            {mineContent}
          </motion.div>
        )}
      </AnimatePresence>
    </Tabs>
  )
}
