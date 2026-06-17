// components/layout/sidebar-nav-config.ts
import { HELP_SUPPORT_LABEL } from '@/lib/support'
import type { ModuleKey } from '@/lib/permissions/module-permissions'
import type { LucideIcon } from 'lucide-react'
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
  UserCircle,
} from 'lucide-react'

export type SidebarSection = 'Main' | 'Operations' | 'System'

export interface SidebarNavItem {
  href: string
  icon: LucideIcon
  label: string
  section: SidebarSection
  moduleKey?: ModuleKey
  alwaysVisible?: boolean
  hasEmployeeFallback?: boolean
}

export const SIDEBAR_SECTIONS: SidebarSection[] = ['Main', 'Operations', 'System']

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    href: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
    section: 'Main',
    moduleKey: 'dashboard',
    hasEmployeeFallback: true,
  },
  { href: '/employees', icon: Users, label: 'Employees', section: 'Main', moduleKey: 'employees' },
  {
    href: '/attendance',
    icon: Clock,
    label: 'Attendance',
    section: 'Main',
    moduleKey: 'attendance',
    hasEmployeeFallback: true,
  },
  {
    href: '/documents',
    icon: FileText,
    label: 'Documents',
    section: 'Main',
    moduleKey: 'documents',
    hasEmployeeFallback: true,
  },
  { href: '/assets', icon: Package, label: 'Assets', section: 'Main', moduleKey: 'assets' },
  {
    href: '/requests',
    icon: MessageSquare,
    label: 'Requests',
    section: 'Operations',
    moduleKey: 'requests',
    hasEmployeeFallback: true,
  },
  { href: '/tickets', icon: LifeBuoy, label: HELP_SUPPORT_LABEL, section: 'Operations', moduleKey: 'tickets' },
  {
    href: '/payroll',
    icon: DollarSign,
    label: 'Payroll',
    section: 'Operations',
    moduleKey: 'payroll',
    hasEmployeeFallback: true,
  },
  { href: '/reports', icon: BarChart3, label: 'Reports', section: 'Operations', moduleKey: 'reports' },
  { href: '/settings', icon: Settings, label: 'Settings', section: 'System', moduleKey: 'settings' },
  { href: '/profile', icon: UserCircle, label: 'Profile', section: 'System', alwaysVisible: true },
]

