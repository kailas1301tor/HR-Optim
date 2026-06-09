'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Users, Package, Settings, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonPageHeader } from '@/components/common'
import { uiTabChipInactive } from '@/lib/ui/design-system'
import { CompanySettings } from './company-settings'
import { HRTabContent } from './hr-tab-content'
import { RolesPermissions } from './roles-permissions'
import { AssetMasters } from './asset-masters'
import { SystemSettings } from './system-settings'
import {
  INITIAL_WORKFLOW_TEMPLATES,
  INITIAL_NOTIFICATIONS,
} from './settings-constants'
import type { PayrollRule } from './leave-payroll-rules'
import type { WorkflowTemplate } from './workflow-templates'

export function SettingsPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || 'company'

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const [payrollRules, setPayrollRules] = useState<PayrollRule[]>([])
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(INITIAL_WORKFLOW_TEMPLATES)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const tabTriggerClass = cn(
    'gap-2 rounded-xl py-2 px-3.5 text-sm font-medium transition-all duration-300 cursor-pointer shrink-0 border',
    uiTabChipInactive,
    'data-[state=active]:bg-violet-core/15 data-[state=active]:text-violet-glow data-[state=active]:border-violet-core/30'
  )

  return (
    <div className="space-y-6">
      <CommonPageHeader
        title="Masters & Configuration"
        subtitle="Manage system masters and configuration settings"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-midnight/60 border border-border/40 p-1.5 rounded-xl h-auto gap-1 flex w-full overflow-x-auto scrollbar-none justify-start select-none">
          <TabsTrigger value="company" className={tabTriggerClass}>
            <Building2 className="h-4 w-4" />
            Company Structure
          </TabsTrigger>
          <TabsTrigger value="roles" className={tabTriggerClass}>
            <ShieldCheck className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="hr" className={tabTriggerClass}>
            <Users className="h-4 w-4" />
            HR Management
          </TabsTrigger>
          <TabsTrigger value="assets" className={tabTriggerClass}>
            <Package className="h-4 w-4" />
            Asset Management
          </TabsTrigger>
          <TabsTrigger value="system" className={tabTriggerClass}>
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 outline-none">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6 outline-none">
          <RolesPermissions />
        </TabsContent>

        <TabsContent value="hr" className="space-y-6 outline-none">
          <HRTabContent
            payrollRules={payrollRules}
            setPayrollRules={setPayrollRules}
            workflowTemplates={workflowTemplates}
            setWorkflowTemplates={setWorkflowTemplates}
          />
        </TabsContent>

        <TabsContent value="assets" className="space-y-6 outline-none">
          <AssetMasters />
        </TabsContent>

        <TabsContent value="system" className="space-y-6 outline-none">
          <SystemSettings notifications={notifications} setNotifications={setNotifications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
