// components/layout/shell-top-bar.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Building2,
  Bell,
  User,
  LogOut,
  Search,
  Menu,
  ChevronLeft,
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
import {
  uiShellHeader,
  uiShellHeaderInset,
  SHELL_SIDEBAR_WIDTH_COLLAPSED,
  SHELL_SIDEBAR_WIDTH_EXPANDED,
} from '@/lib/ui/design-system'
import { useSidebar } from './useSidebar'
import type { UserProfile } from './app-shell'

interface ShellTopBarProps {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  onSearchOpen: () => void
  onMenuClick: () => void
  userProfile: UserProfile
  isMobile: boolean
}

export function ShellTopBar({
  collapsed,
  setCollapsed,
  onSearchOpen,
  onMenuClick,
  userProfile,
  isMobile,
}: ShellTopBarProps) {
  const { handleLogout, breadcrumbs, pathname } = useSidebar()

  const brandWidth = isMobile
    ? undefined
    : collapsed
    ? SHELL_SIDEBAR_WIDTH_COLLAPSED
    : SHELL_SIDEBAR_WIDTH_EXPANDED

  const showBreadcrumbs = pathname !== '/' && breadcrumbs.length > 0

  return (
    <header
      className={cn(
        uiShellHeader,
        'fixed top-0 left-0 right-0 z-50 bg-midnight',
        'flex items-stretch'
      )}
    >
      {/* Brand zone — width locked to sidebar column on desktop */}
      <div
        className={cn(
          'shrink-0 flex items-center gap-2 border-r border-border transition-[width] duration-300 ease-in-out',
          isMobile ? 'px-3' : cn(uiShellHeaderInset, 'pr-3'),
          collapsed && !isMobile && 'justify-center !px-0'
        )}
        style={brandWidth !== undefined ? { width: brandWidth } : undefined}
      >
        {isMobile && (
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 hover:bg-carbon rounded-lg text-slate-400 hover:text-cloud transition-colors cursor-pointer shrink-0"
            aria-label="Open main menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          className={cn(
            'flex items-center gap-2.5 min-w-0 flex-1',
            collapsed && !isMobile && 'justify-center flex-none'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-cloud truncate leading-none">HRMS Portal</p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">Management</p>
            </div>
          )}
        </div>

        {!isMobile && !collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="shrink-0 ml-auto p-1.5 hover:bg-carbon rounded-md text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* App chrome — breadcrumbs + utilities */}
      <div
        className={cn(
          'flex-1 flex items-center justify-between gap-4 min-w-0',
          uiShellHeaderInset
        )}
      >
        <nav className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-medium min-w-0 truncate">
          {showBreadcrumbs && (
            <>
              <Link href="/" className="text-muted-foreground hover:text-cloud transition-colors shrink-0">
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground shrink-0">/</span>
                  <Link
                    href={crumb.href}
                    className={cn(
                      'truncate transition-colors',
                      index === breadcrumbs.length - 1
                        ? 'text-cloud font-semibold'
                        : 'text-muted-foreground hover:text-cloud'
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={onSearchOpen}
            className="flex items-center gap-2 h-9 px-3 sm:px-4 bg-carbon/80 border border-border rounded-full text-xs sm:text-sm text-muted-foreground hover:text-cloud hover:border-violet-core/40 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-midnight text-[9px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            className="relative p-2 hover:bg-carbon rounded-lg transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-core rounded-full" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center p-1 hover:bg-carbon rounded-lg transition-colors cursor-pointer"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs font-mono">
                    {userProfile.initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold text-cloud">{userProfile.fullName}</span>
                  <span className="text-xs text-muted-foreground">{userProfile.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                Profile
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
      </div>
    </header>
  )
}
