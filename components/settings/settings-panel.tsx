// components/settings/settings-panel.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Users, Package, Settings, ShieldCheck, Calculator, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiTabChipActiveTrigger, uiTabChipBase, uiTabChipInactive } from '@/lib/ui/design-system'
import { CompanySettings } from './company-settings'
import { HRTabContent } from './hr-tab-content'
import { PayRulesMaster } from './payroll/pay-rules-master'
import { RolesPermissions } from './roles-permissions'
import { AssetMasters } from './asset-masters'
import { SecuritySettings } from './security-settings'
import { SystemSettings } from './system-settings'
import { SettingsSkeleton } from './settings-skeleton'
import {
  INITIAL_WORKFLOW_TEMPLATES,
} from './settings-constants'
import type { WorkflowTemplate } from '@/types/settings'
import { usePermissions } from '@/components/auth/permissions-provider'

export function SettingsPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isLoading: isPermissionsLoading, canManage } = usePermissions()
  const canManageSettings = canManage('settings')

  const activeTab = searchParams.get('tab') || 'company'

  const setActiveTab = useCallback((tab: string) => {
    if (tab === activeTab) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`${pathname}?${params.toString()}`)
  }, [activeTab, pathname, router, searchParams])

  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(INITIAL_WORKFLOW_TEMPLATES)

  useEffect(() => {
    if (isPermissionsLoading) return
    if (canManageSettings || activeTab !== 'roles') return
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', 'company')
    router.replace(`${pathname}?${params.toString()}`)
  }, [isPermissionsLoading, canManageSettings, activeTab, pathname, router, searchParams])

  const tabTriggerClass = cn(
    uiTabChipBase,
    'gap-2 text-sm shrink-0 grow-0 flex-none',
    uiTabChipInactive,
    uiTabChipActiveTrigger,
  )

  if (isPermissionsLoading) {
    return <SettingsSkeleton showHeader={false} />
  }

  return (
    <div className="space-y-6">

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-midnight/60 border border-border/40 p-1.5 rounded-[20px] [corner-shape:squircle] h-auto gap-1.5 flex flex-wrap w-full justify-start items-start content-start select-none">
          <TabsTrigger value="company" className={tabTriggerClass}>
            <Building2 className="h-4 w-4" />
            Company Structure
          </TabsTrigger>
          {canManageSettings ? (
          <TabsTrigger value="roles" className={tabTriggerClass}>
            <ShieldCheck className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          ) : null}
          <TabsTrigger value="hr" className={tabTriggerClass}>
            <Users className="h-4 w-4" />
            HR Management
          </TabsTrigger>
          <TabsTrigger value="payroll" className={tabTriggerClass}>
            <Calculator className="h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="assets" className={tabTriggerClass}>
            <Package className="h-4 w-4" />
            Asset Management
          </TabsTrigger>
          <TabsTrigger value="security" className={tabTriggerClass}>
            <Lock className="h-4 w-4" />
            Security
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
          {activeTab === 'roles' && canManageSettings ? <RolesPermissions /> : null}
        </TabsContent>

        <TabsContent value="hr" className="space-y-6 outline-none">
          <HRTabContent
            workflowTemplates={workflowTemplates}
            setWorkflowTemplates={setWorkflowTemplates}
          />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6 outline-none">
          <PayRulesMaster />
        </TabsContent>

        <TabsContent value="assets" className="space-y-6 outline-none">
          <AssetMasters />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 outline-none">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-6 outline-none">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
