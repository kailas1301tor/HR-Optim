// components/settings/hr-tab-content.tsx
'use client'

import { useState } from 'react'
import { CommonFilterChips } from '@/components/common'
import { HRMasters } from './hr-masters'
import { WorkflowTemplates, type WorkflowTemplate } from './workflow-templates'

const HR_SECTION_OPTIONS = [
  { value: 'masters', label: 'Masters' },
  { value: 'workflows', label: 'Workflows' },
] as const

type HRSection = (typeof HR_SECTION_OPTIONS)[number]['value']

interface HRTabContentProps {
  workflowTemplates: WorkflowTemplate[]
  setWorkflowTemplates: (templates: WorkflowTemplate[]) => void
}

export function HRTabContent({
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
      {section === 'workflows' && (
        <WorkflowTemplates
          workflowTemplates={workflowTemplates}
          setWorkflowTemplates={setWorkflowTemplates}
        />
      )}
    </div>
  )
}
