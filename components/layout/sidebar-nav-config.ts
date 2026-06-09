// components/layout/sidebar-nav-config.ts
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Package,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
} from 'lucide-react'

export type SidebarSection = 'Main' | 'Operations' | 'System'

export interface SidebarNavItem {
  href: string
  icon: LucideIcon
  label: string
  section: SidebarSection
}

export const SIDEBAR_SECTIONS: SidebarSection[] = ['Main', 'Operations', 'System']

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', section: 'Main' },
  { href: '/employees', icon: Users, label: 'Employees', section: 'Main' },
  { href: '/attendance', icon: Clock, label: 'Attendance', section: 'Main' },
  { href: '/documents', icon: FileText, label: 'Documents', section: 'Main' },
  { href: '/assets', icon: Package, label: 'Assets', section: 'Main' },
  { href: '/requests', icon: MessageSquare, label: 'Requests', section: 'Operations' },
  { href: '/payroll', icon: DollarSign, label: 'Payroll', section: 'Operations' },
  { href: '/reports', icon: BarChart3, label: 'Reports', section: 'Operations' },
  { href: '/settings', icon: Settings, label: 'Settings', section: 'System' },
]
