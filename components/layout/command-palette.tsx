// components/layout/command-palette.tsx
'use client'

import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiSquircleLg } from '@/lib/ui/design-system'
import { usePermissions } from '@/components/auth/permissions-provider'
import {
  canViewEmployeesSection,
  hasEmployeeFallback,
} from '@/lib/permissions/module-permissions'
import { useCommandPalette } from './useCommandPalette'
import { EmployeesSearchGroup, AssetsSearchGroup, TicketsSearchGroup, AttendanceSearchGroup, RequestsSearchGroup } from './search-groups'
import { pages, accountPages, quickActions } from './command-palette-constants'
import {
  SearchLoadingSkeleton,
  QuickActionsGroup,
  AccountGroup,
  PagesGroup,
} from './command-palette-static-groups'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { search, setSearch, handleSelect, results, isLoading } = useCommandPalette({ open, onOpenChange })
  const { canView, canManage, permissions } = usePermissions()

  const q = search.trim().toLowerCase()

  // Filter static pages, quick actions, account pages locally using Javascript
  const canSearchEmployees = canViewEmployeesSection(permissions)
  const searchPlaceholder = canSearchEmployees
    ? 'Search employees, pages, or actions...'
    : 'Search pages or actions...'

  const filteredPages = pages
    .filter((page) => {
      if (page.moduleKey === 'employees') {
        return canSearchEmployees
      }
      if (hasEmployeeFallback(page.moduleKey)) {
        return true
      }
      return canView(page.moduleKey)
    })
    .filter((page) => {
      if (!q) return true
      return (
        page.name.toLowerCase().includes(q) ||
        page.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })

  const filteredQuickActions = quickActions
    .filter((action) => canManage(action.moduleKey))
    .filter((action) => {
      if (!q) return true
      return action.name.toLowerCase().includes(q)
    })

  const filteredAccountPages = accountPages.filter((page) => {
    if (!q) return true
    return (
      page.name.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })

  // Check if we have any dynamic results that are visible to this user
  const hasDynamicResults =
    results &&
    ((results.employees && results.employees.length > 0 && canViewEmployeesSection(permissions)) ||
      (results.attendance && results.attendance.length > 0 && canView('attendance')) ||
      (results.requests && results.requests.length > 0 && canView('requests')) ||
      (results.assets && results.assets.length > 0 && canView('assets')) ||
      (results.tickets && results.tickets.length > 0 && canView('tickets')))

  const hasAnyItems =
    filteredPages.length > 0 ||
    filteredQuickActions.length > 0 ||
    filteredAccountPages.length > 0 ||
    hasDynamicResults ||
    isLoading

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => onOpenChange(false)}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <Command
              className={cn('bg-carbon border border-border shadow-2xl overflow-hidden', uiSquircleLg)}
              shouldFilter={false}
            >
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder={searchPlaceholder}
                  className="flex-1 h-14 bg-transparent text-foreground text-base placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="px-2 py-1 text-xs font-medium text-muted-foreground bg-midnight rounded">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                {!hasAnyItems && (
                  <div className="py-6 text-center text-muted-foreground text-sm">
                    No results found.
                  </div>
                )}

                {/* Quick Actions */}
                {filteredQuickActions.length > 0 && (
                  <QuickActionsGroup quickActions={filteredQuickActions} onSelect={handleSelect} />
                )}

                {/* Account */}
                {filteredAccountPages.length > 0 && (
                  <AccountGroup accountPages={filteredAccountPages} onSelect={handleSelect} />
                )}

                {/* Pages */}
                {filteredPages.length > 0 && (
                  <PagesGroup pages={filteredPages} onSelect={handleSelect} />
                )}

                {/* Loading Skeleton */}
                {isLoading && <SearchLoadingSkeleton />}

                {/* Dynamic Employees Results */}
                {!isLoading && results?.employees && results.employees.length > 0 && canViewEmployeesSection(permissions) && (
                  <EmployeesSearchGroup employees={results.employees} onSelect={handleSelect} />
                )}

                {/* Dynamic Attendance Results */}
                {!isLoading && results?.attendance && results.attendance.length > 0 && canView('attendance') && (
                  <AttendanceSearchGroup attendance={results.attendance} onSelect={handleSelect} />
                )}

                {/* Dynamic Requests Results */}
                {!isLoading && results?.requests && results.requests.length > 0 && canView('requests') && (
                  <RequestsSearchGroup requests={results.requests} onSelect={handleSelect} />
                )}

                {/* Dynamic Assets Results */}
                {!isLoading && results?.assets && results.assets.length > 0 && canView('assets') && (
                  <AssetsSearchGroup assets={results.assets} onSelect={handleSelect} />
                )}

                {/* Dynamic Tickets Results */}
                {!isLoading && results?.tickets && results.tickets.length > 0 && canView('tickets') && (
                  <TicketsSearchGroup tickets={results.tickets} onSelect={handleSelect} />
                )}

              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

