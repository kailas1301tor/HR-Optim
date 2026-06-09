// components/settings/workflow-templates.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Plus, Trash2, Edit3, X } from 'lucide-react'
import { CommonStatusBadge } from '@/components/common'
import { uiSectionHeader } from '@/lib/ui/design-system'

export interface WorkflowTemplate {
  name: string
  steps: string[]
}

interface WorkflowTemplatesProps {
  workflowTemplates: WorkflowTemplate[]
  setWorkflowTemplates: (templates: WorkflowTemplate[]) => void
}

export function WorkflowTemplates({
  workflowTemplates,
  setWorkflowTemplates,
}: WorkflowTemplatesProps) {
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
  const [workflowEditIndex, setWorkflowEditIndex] = useState<number | null>(null)
  
  // Workflow Form Fields
  const [workflowName, setWorkflowName] = useState('')
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([])
  const [newStepText, setNewStepText] = useState('')

  const handleOpenAddWorkflow = () => {
    setWorkflowName('')
    setWorkflowSteps([])
    setNewStepText('')
    setWorkflowEditIndex(null)
    setIsWorkflowModalOpen(true)
  }

  const handleOpenEditWorkflow = (index: number) => {
    const template = workflowTemplates[index]
    if (!template) return
    setWorkflowName(template.name)
    setWorkflowSteps(template.steps)
    setNewStepText('')
    setWorkflowEditIndex(index)
    setIsWorkflowModalOpen(true)
  }

  const handleSaveWorkflow = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workflowName.trim()) return

    const newTemplate: WorkflowTemplate = {
      name: workflowName.trim().toUpperCase(),
      steps: workflowSteps,
    }

    if (workflowEditIndex !== null) {
      const updated = [...workflowTemplates]
      updated[workflowEditIndex] = newTemplate
      setWorkflowTemplates(updated)
    } else {
      setWorkflowTemplates([...workflowTemplates, newTemplate])
    }
    setIsWorkflowModalOpen(false)
  }

  const handleAddStep = () => {
    if (!newStepText.trim()) return
    setWorkflowSteps([...workflowSteps, newStepText.trim()])
    setNewStepText('')
  }

  const handleRemoveStep = (stepIndex: number) => {
    setWorkflowSteps(workflowSteps.filter((_, i) => i !== stepIndex))
  }

  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-cloud">Workflow Checklists Templates</h2>
          <CommonStatusBadge variant="draft" label="Preview — not persisted" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Configure step checklists templates for onboarding and offboarding</p>
      </div>

      <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base text-cloud font-semibold">Workflow Templates</CardTitle>
          </div>
          <button
            onClick={handleOpenAddWorkflow}
            className="text-xs font-semibold text-violet-glow hover:text-violet-deep transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Template
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {workflowTemplates.map((template, index) => (
            <div
              key={template.name + index}
              className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">{template.name}</span>
                <span className="text-xs text-slate-400">
                  {template.steps.length > 0 ? template.steps.join(' ➔ ') : 'No steps configured'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                  onClick={() => handleOpenEditWorkflow(index)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                  onClick={() => setWorkflowTemplates(workflowTemplates.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workflow Modal */}
      <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {workflowEditIndex !== null ? 'Edit Workflow Template' : 'Add Workflow Template'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveWorkflow} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">Template Name</Label>
              <Input id="workflow-name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} placeholder="e.g. ONBOARDING" className="bg-midnight border-border rounded-xl text-sm" required />
            </div>

            {/* Steps Section */}
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">Checklist Steps</Label>
              <div className="flex gap-2">
                <Input value={newStepText} onChange={(e) => setNewStepText(e.target.value)} placeholder="e.g. IT Setup" className="bg-midnight border-border rounded-xl text-sm flex-1" />
                <Button type="button" onClick={handleAddStep} className="bg-violet-core hover:bg-violet-deep text-white rounded-xl h-10 px-4 cursor-pointer">Add</Button>
              </div>

              <div className="space-y-1.5 pt-3">
                {workflowSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-midnight/60 border border-border/40 rounded-xl px-3 py-2 text-xs">
                    <span className="text-slate-300 font-medium">{idx + 1}. {step}</span>
                    <button type="button" onClick={() => handleRemoveStep(idx)} className="text-slate-400 hover:text-red-400 cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border/40">
              <DialogClose asChild><Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">Cancel</Button></DialogClose>
              <Button type="submit" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer">Save Template</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
