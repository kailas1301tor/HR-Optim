// components/settings/hr-tab-content.tsx
'use client'

import { useState } from 'react'
import { CommonFilterChips } from '@/components/common'
import { HRMasters } from './hr-masters'
import { LeaveRulesConfig } from './leave-rules-config'
import { LeavePayrollRules, type PayrollRule } from './leave-payroll-rules'
import { WorkflowTemplates, type WorkflowTemplate } from './workflow-templates'

const HR_SECTION_OPTIONS = [
  { value: 'masters', label: 'Masters' },
  { value: 'leave-rules', label: 'Leave Rules' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'workflows', label: 'Workflows' },
] as const

type HRSection = (typeof HR_SECTION_OPTIONS)[number]['value']

interface HRTabContentProps {
  payrollRules: PayrollRule[]
  setPayrollRules: (rules: PayrollRule[]) => void
  workflowTemplates: WorkflowTemplate[]
  setWorkflowTemplates: (templates: WorkflowTemplate[]) => void
}

export function HRTabContent({
  payrollRules,
  setPayrollRules,
  workflowTemplates,
  setWorkflowTemplates,
}: HRTabContentProps) {
  const [section, setSection] = useState<HRSection>('masters')

  return (
    <div className="space-y-6 outline-none">
      <CommonFilterChips
        options={HR_SECTION_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        value={section}
        onChange={(value) => setSection(value as HRSection)}
      />

      {section === 'masters' && <HRMasters />}
      {section === 'leave-rules' && <LeaveRulesConfig />}
      {section === 'payroll' && (
        <LeavePayrollRules payrollRules={payrollRules} setPayrollRules={setPayrollRules} />
      )}
      {section === 'workflows' && (
        <WorkflowTemplates
          workflowTemplates={workflowTemplates}
          setWorkflowTemplates={setWorkflowTemplates}
        />
      )}
    </div>
  )
}
