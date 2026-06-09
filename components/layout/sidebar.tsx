// components/layout/sidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SHELL_SIDEBAR_WIDTH_COLLAPSED,
  SHELL_SIDEBAR_WIDTH_EXPANDED,
} from '@/lib/ui/design-system'
import {
  Bell,
  User,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from './useSidebar'
import { SidebarMagnificationNav } from './sidebar-magnification-nav'
import type { UserProfile } from './app-shell'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void
  userProfile: UserProfile
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, userProfile }: SidebarProps) {
  const { handleLogout, pathname } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobileMode = window.innerWidth < 768
      setIsMobile(mobileMode)
      if (!mobileMode) {
        setMobileOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <motion.aside
      initial={false}
      animate={
        isMobile
          ? { x: mobileOpen ? 0 : -SHELL_SIDEBAR_WIDTH_EXPANDED, width: SHELL_SIDEBAR_WIDTH_EXPANDED }
          : { x: 0, width: collapsed ? SHELL_SIDEBAR_WIDTH_COLLAPSED : SHELL_SIDEBAR_WIDTH_EXPANDED }
      }
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 bg-midnight border-r border-border flex flex-col shadow-2xl md:shadow-none overflow-x-visible',
        'top-16 h-[calc(100vh-4rem)] z-40'
      )}
    >
      {!isMobile && collapsed && (
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-full h-9 hover:bg-carbon rounded-lg text-slate-400 hover:text-cloud transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <SidebarMagnificationNav
        collapsed={collapsed}
        isMobile={isMobile}
        pathname={pathname}
      />

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-carbon rounded-lg p-2 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs font-mono">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 text-left overflow-hidden"
                  >
                    <p className="text-sm font-medium text-cloud truncate">{userProfile.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userProfile.roleName}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-popover border border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2 text-slate-400" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="w-4 h-4 mr-2 text-slate-400" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border-border/40" />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  )
}
