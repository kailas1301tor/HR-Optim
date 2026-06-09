// components/layout/app-shell.tsx
'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { ShellTopBar } from '@/components/layout/shell-top-bar'
import { CommandPalette } from '@/components/layout/command-palette'
import { cn } from '@/lib/utils'
import { useAppShell } from './useAppShell'

export interface UserProfile {
  fullName: string
  email: string
  roleName: string
  initials: string
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const {
    searchOpen,
    setSearchOpen,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    userProfile,
  } = useAppShell()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ShellTopBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onSearchOpen={() => setSearchOpen(true)}
        onMenuClick={() => setMobileOpen(true)}
        userProfile={userProfile}
        isMobile={isMobile}
      />

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 bg-background/60 backdrop-blur-md z-30 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userProfile={userProfile}
      />

      <div
        className={cn(
          'transition-all duration-300 ease-in-out pt-16 pl-0 min-h-screen flex flex-col',
          'md:pl-[var(--shell-sidebar-width)]',
          collapsed && 'md:pl-[var(--shell-sidebar-width-collapsed)]'
        )}
      >
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
          {children}
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
