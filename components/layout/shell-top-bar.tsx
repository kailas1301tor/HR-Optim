// components/layout/shell-top-bar.tsx
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Bell,
  User,
  LogOut,
  Search,
  Menu,
  ChevronLeft,
  Settings,
} from 'lucide-react'
import { BrandLogo } from '@/components/common'
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
  uiSquircleNav,
  uiSquircleSm,
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

interface ShellIconButtonProps {
  label: string
  onClick: () => void
  children: ReactNode
  className?: string
  showDot?: boolean
}

function ShellIconButton({
  label,
  onClick,
  children,
  className,
  showDot = false,
}: ShellIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center rounded-full',
        'text-slate-300 transition-colors hover:bg-carbon/80 hover:text-cloud',
        className,
      )}
    >
      {children}
      {showDot ? (
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-core ring-2 ring-midnight" />
      ) : null}
    </button>
  )
}

function UserMenuDropdown({ userProfile }: { userProfile: UserProfile }) {
  const { handleLogout, handleGoToProfile, handleGoToSettings } = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-carbon/80"
        >
          <Avatar className="size-8 ring-2 ring-border/60">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-[10px] font-semibold text-white">
              {userProfile.initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 max-w-[calc(100vw-2rem)] border border-border bg-popover"
      >
        <DropdownMenuLabel className="min-w-0 overflow-hidden">
          <div className="flex min-w-0 flex-col gap-0.5 overflow-hidden">
            <span className="truncate font-semibold text-cloud" title={userProfile.fullName}>
              {userProfile.fullName}
            </span>
            <span className="truncate text-xs text-muted-foreground" title={userProfile.email}>
              {userProfile.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="border-border/40" />
        <DropdownMenuItem className="cursor-pointer" onSelect={handleGoToProfile}>
          <User className="mr-2 size-4 text-slate-400" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onSelect={handleGoToSettings}>
          <Settings className="mr-2 size-4 text-slate-400" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-border/40" />
        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ShellTopBar({
  collapsed,
  setCollapsed,
  onSearchOpen,
  onMenuClick,
  userProfile,
  isMobile,
}: ShellTopBarProps) {
  const {
    handleGoToNotifications,
    breadcrumbs,
    pathname,
  } = useSidebar()

  const brandWidth = collapsed ? SHELL_SIDEBAR_WIDTH_COLLAPSED : SHELL_SIDEBAR_WIDTH_EXPANDED
  const showBreadcrumbs = pathname !== '/' && breadcrumbs.length > 0
  const mobilePageTitle =
    pathname === '/'
      ? 'Dashboard'
      : (breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Dashboard')

  if (isMobile) {
    return (
      <header className={cn(uiShellHeader, 'fixed inset-x-0 top-0 z-50')}>
        <div className="flex w-full min-w-0 items-center gap-2 px-3">
          <ShellIconButton label="Open main menu" onClick={onMenuClick}>
            <Menu className="size-5" />
          </ShellIconButton>

          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Go to dashboard"
          >
            <BrandLogo variant="mark" size="sm" priority />
          </Link>

          <div className="min-w-0 flex-1 px-1">
            <p className="truncate text-sm font-semibold leading-tight text-cloud">
              {mobilePageTitle}
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {userProfile.roleName}
            </p>
          </div>

          <div
            className={cn(
              'flex shrink-0 items-center gap-0.5 rounded-full border border-border/50 bg-carbon/40 p-0.5',
            )}
          >
            <ShellIconButton label="Search" onClick={onSearchOpen}>
              <Search className="size-4" />
            </ShellIconButton>
            <ShellIconButton label="Notifications" onClick={handleGoToNotifications} showDot>
              <Bell className="size-4" />
            </ShellIconButton>
          </div>

          <UserMenuDropdown userProfile={userProfile} />
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        uiShellHeader,
        'fixed inset-x-0 top-0 z-50 flex items-stretch',
      )}
    >
      {/* Brand zone — width locked to sidebar column on desktop */}
      <div
        className={cn(
          'flex shrink-0 items-center border-r border-border transition-[width] duration-300 ease-in-out',
          collapsed ? 'justify-center px-0' : 'gap-0 pl-5 pr-1',
        )}
        style={{ width: brandWidth }}
      >
        <Link
          href="/"
          className={cn(
            'flex min-w-0 items-center py-1.5',
            !collapsed && 'min-w-0 flex-1 pr-1 pl-2',
            collapsed && 'justify-center px-2',
          )}
          aria-label="Go to dashboard"
        >
          {collapsed ? (
            <BrandLogo variant="mark" size="lg" />
          ) : (
            <BrandLogo variant="full" size="lg" showTagline className="w-full" />
          )}
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className={cn(
              'shrink-0 p-1 text-slate-500 transition-colors hover:bg-carbon hover:text-slate-300 cursor-pointer',
              uiSquircleNav,
            )}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        )}
      </div>

      {/* App chrome — breadcrumbs + utilities */}
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center justify-between gap-4',
          uiShellHeaderInset,
        )}
      >
        <nav className="flex min-w-0 items-center gap-2 truncate text-xs font-medium sm:text-sm">
          {showBreadcrumbs && (
            <>
              <Link href="/" className="shrink-0 text-muted-foreground transition-colors hover:text-cloud">
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-muted-foreground">/</span>
                  <Link
                    href={crumb.href}
                    className={cn(
                      'truncate transition-colors',
                      index === breadcrumbs.length - 1
                        ? 'font-semibold text-cloud'
                        : 'text-muted-foreground hover:text-cloud',
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </>
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSearchOpen}
            className={cn(
              'flex h-9 cursor-pointer items-center gap-2 border border-border bg-carbon/80 px-4 text-sm text-muted-foreground transition-all hover:border-violet-core/40 hover:text-cloud',
              uiSquircleSm,
            )}
          >
            <Search className="size-4 shrink-0 text-slate-400" />
            <span>Search...</span>
            <kbd className="inline-flex h-5 items-center gap-1 rounded bg-midnight px-1.5 text-[9px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <ShellIconButton label="Notifications" onClick={handleGoToNotifications} showDot>
            <Bell className="size-5" />
          </ShellIconButton>

          <UserMenuDropdown userProfile={userProfile} />
        </div>
      </div>
    </header>
  )
}
