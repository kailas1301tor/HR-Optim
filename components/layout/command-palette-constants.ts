// components/layout/command-palette-constants.ts
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
  User,
  Plus,
  FileCheck,
} from 'lucide-react'
import { HELP_SUPPORT_LABEL } from '@/lib/support'
import type { ModuleKey } from '@/lib/permissions/module-permissions'

export const pages: Array<{
  name: string
  icon: typeof LayoutDashboard
  href: string
  keywords: string[]
  moduleKey: ModuleKey
}> = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', keywords: ['home', 'overview', 'kpi'], moduleKey: 'dashboard' },
  { name: 'Employees', icon: Users, href: '/employees', keywords: ['staff', 'team', 'people'], moduleKey: 'employees' },
  { name: 'Attendance', icon: Clock, href: '/attendance', keywords: ['time', 'present', 'absent'], moduleKey: 'attendance' },
  { name: 'Documents', icon: FileText, href: '/documents', keywords: ['files', 'upload', 'expiry'], moduleKey: 'documents' },
  { name: 'Assets', icon: Package, href: '/assets', keywords: ['inventory', 'equipment', 'items'], moduleKey: 'assets' },
  { name: 'Requests', icon: MessageSquare, href: '/requests', keywords: ['leave', 'approval', 'pending'], moduleKey: 'requests' },
  { name: HELP_SUPPORT_LABEL, icon: LifeBuoy, href: '/tickets', keywords: ['support', 'help', 'issue', 'ticket', 'contact'], moduleKey: 'tickets' },
  { name: 'Payroll', icon: DollarSign, href: '/payroll', keywords: ['salary', 'wages', 'payment'], moduleKey: 'payroll' },
  { name: 'Reports', icon: BarChart3, href: '/reports', keywords: ['analytics', 'export', 'data'], moduleKey: 'reports' },
  { name: 'Settings', icon: Settings, href: '/settings', keywords: ['config', 'preferences'], moduleKey: 'settings' },
]

export const accountPages = [
  { name: 'My Profile', icon: User, href: '/profile', keywords: ['account', 'me', 'user', 'profile'] },
]

export const quickActions: Array<{
  name: string
  icon: typeof Plus
  action: string
  moduleKey: ModuleKey
}> = [
  { name: 'Add New Employee', icon: Plus, action: 'employees?action=add-employee', moduleKey: 'employees' },
  { name: 'Submit Leave Request', icon: FileCheck, action: 'requests/new?type=leave', moduleKey: 'requests' },
  { name: 'Upload Document', icon: FileText, action: 'documents?action=upload-document', moduleKey: 'documents' },
  { name: 'Generate Report', icon: BarChart3, action: 'reports', moduleKey: 'reports' },
]
