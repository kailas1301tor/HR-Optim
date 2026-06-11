// components/layout/command-palette.tsx
'use client'

import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Package,
  MessageSquare,
  LifeBuoy,
  DollarSign,
  BarChart3,
  Settings,
  Search,
  User,
  FileCheck,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiSquircleLg, uiSquircleNav, uiSquircleXs } from '@/lib/ui/design-system'
import { useCommandPalette } from './useCommandPalette'

const pages = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', keywords: ['home', 'overview', 'kpi'] },
  { name: 'Employees', icon: Users, href: '/employees', keywords: ['staff', 'team', 'people'] },
  { name: 'Attendance', icon: Clock, href: '/attendance', keywords: ['time', 'present', 'absent'] },
  { name: 'Documents', icon: FileText, href: '/documents', keywords: ['files', 'upload', 'expiry'] },
  { name: 'Assets', icon: Package, href: '/assets', keywords: ['inventory', 'equipment', 'items'] },
  { name: 'Requests', icon: MessageSquare, href: '/requests', keywords: ['leave', 'approval', 'pending'] },
  { name: 'Tickets', icon: LifeBuoy, href: '/tickets', keywords: ['support', 'help', 'issue'] },
  { name: 'Payroll', icon: DollarSign, href: '/payroll', keywords: ['salary', 'wages', 'payment'] },
  { name: 'Reports', icon: BarChart3, href: '/reports', keywords: ['analytics', 'export', 'data'] },
  { name: 'Settings', icon: Settings, href: '/settings', keywords: ['config', 'preferences'] },
]

const employees = [
  { name: 'Ahmed Al Maktoum', id: 'EMP-001', department: 'Engineering' },
  { name: 'Sarah Johnson', id: 'EMP-002', department: 'HR' },
  { name: 'Mohammed Hassan', id: 'EMP-003', department: 'Finance' },
  { name: 'Fatima Al Rashid', id: 'EMP-004', department: 'Marketing' },
  { name: 'James Wilson', id: 'EMP-005', department: 'Operations' },
]

const quickActions = [
  { name: 'Add New Employee', icon: Plus, action: 'add-employee' },
  { name: 'Submit Leave Request', icon: FileCheck, action: 'leave-request' },
  { name: 'Upload Document', icon: FileText, action: 'upload-doc' },
  { name: 'Generate Report', icon: BarChart3, action: 'generate-report' },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { search, setSearch, handleSelect } = useCommandPalette({ open, onOpenChange })

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
              shouldFilter={true}
            >
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search employees, pages, or actions..."
                  className="flex-1 h-14 bg-transparent text-foreground text-base placeholder:text-muted-foreground focus:outline-none"
                />
                <kbd className="px-2 py-1 text-xs font-medium text-muted-foreground bg-midnight rounded">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-muted-foreground">
                  No results found.
                </Command.Empty>

                {/* Quick Actions */}
                <Command.Group heading="Quick Actions" className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Quick Actions
                  </div>
                  {quickActions.map((action) => (
                    <Command.Item
                      key={action.action}
                      value={action.name}
                      onSelect={() => handleSelect(`/${action.action}`)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
                        uiSquircleNav
                      )}
                    >
                      <div className={cn('w-8 h-8 bg-midnight flex items-center justify-center', uiSquircleNav)}>
                        <action.icon className="w-4 h-4 text-violet-glow" />
                      </div>
                      <span className="flex-1 text-sm">{action.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Pages */}
                <Command.Group heading="Pages" className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Pages
                  </div>
                  {pages.map((page) => (
                    <Command.Item
                      key={page.href}
                      value={`${page.name} ${page.keywords.join(' ')}`}
                      onSelect={() => handleSelect(page.href)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
                        uiSquircleNav
                      )}
                    >
                      <div className={cn('w-8 h-8 bg-midnight flex items-center justify-center', uiSquircleNav)}>
                        <page.icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="flex-1 text-sm">{page.name}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>

                {/* Employees */}
                <Command.Group heading="Employees" className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Employees
                  </div>
                  {employees.map((employee) => (
                    <Command.Item
                      key={employee.id}
                      value={`${employee.name} ${employee.id} ${employee.department}`}
                      onSelect={() => handleSelect(`/employees/${employee.id}`)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
                        uiSquircleNav
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono text-violet-glow">{employee.id}</span>
                          {' · '}
                          {employee.department}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
