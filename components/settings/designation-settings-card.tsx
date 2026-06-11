// components/settings/designation-settings-card.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2, Edit3, Loader2, Briefcase } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { useDesignationSettings } from './useDesignationSettings'

export function DesignationSettingsCard() {
  const {
    selectedDeptId,
    departments,
    isDeptLoading,
    deptHasError,
    reloadDepartments,
    designations,
    isLoading,
    designationsHasError,
    reloadDesignations,
    isOpen,
    editId,
    formName,
    formDescription,
    formDepartmentId,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormDescription,
    setFormDepartmentId,
    setDeleteId,
    handleDeptChange,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  } = useDesignationSettings()

  if (deptHasError) {
    return (
      <CommonErrorState
        title="Failed to load departments"
        message="Please check your connection and try again."
        onRetry={reloadDepartments}
        className="min-h-[200px]"
      />
    )
  }

  if (designationsHasError) {
    return (
      <CommonErrorState
        title="Failed to load designations"
        message="Please check your connection and try again."
        onRetry={reloadDesignations}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Designations</CardTitle>
          {selectedDeptId && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="text-xs font-semibold text-violet-glow hover:text-violet-deep transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Department Selector */}
          {isDeptLoading ? (
            <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          ) : (
            <Select value={selectedDeptId} onValueChange={handleDeptChange}>
              <SelectTrigger className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm h-10 cursor-pointer">
                <SelectValue placeholder="Select a department..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/80 rounded-[20px] [corner-shape:squircle]">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)} className="cursor-pointer">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Designation List */}
          {!selectedDeptId ? (
            <CommonEmptyState
              icon={Briefcase}
              title="Select a department"
              description="Choose a department to view and manage its designations."
              className="py-6 shadow-none border-0 bg-transparent"
            />
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className={cn('h-14 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <Skeleton className={cn('h-14 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            </div>
          ) : designations.length === 0 ? (
            <CommonEmptyState
              icon={Briefcase}
              title="No designations found"
              description='Click "Add" to create a designation for this department.'
              className="py-6 shadow-none border-0 bg-transparent"
            />
          ) : (
            <div className="space-y-3">
              {designations.map((desig) => (
                <div
                  key={desig.id}
                  className="flex items-center justify-between bg-midnight border border-border/60 rounded-[20px] [corner-shape:squircle] p-3 hover:border-violet-core/40 transition-all group"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-semibold text-slate-200">{desig.name}</span>
                    {desig.description && (
                      <p className="text-xs text-slate-400 font-normal">{desig.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle] cursor-pointer"
                      onClick={() => handleOpenEdit(desig)}
                      aria-label={`Edit designation ${desig.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-[16px] [corner-shape:squircle] cursor-pointer"
                      onClick={() => setDeleteId(desig.id)}
                      aria-label={`Delete designation ${desig.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) setIsOpen(open) }}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editId !== null ? 'Edit Designation' : 'Add Designation'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {editId !== null ? 'Update the designation details below.' : 'Fill in the details to create a new designation.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Department
              </Label>
              <Select value={formDepartmentId} onValueChange={setFormDepartmentId}>
                <SelectTrigger className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm h-10 cursor-pointer">
                  <SelectValue placeholder="Select a department..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/80 rounded-[20px] [corner-shape:squircle]">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)} className="cursor-pointer">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Designation Name
              </Label>
              <Input
                id="desig-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desig-desc" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Description
              </Label>
              <Textarea
                id="desig-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Develops software applications"
                className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-sm min-h-20"
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter className="pt-4 border-t border-border/40">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-10 rounded-[20px] [corner-shape:squircle] cursor-pointer" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[20px] [corner-shape:squircle] px-5 cursor-pointer flex items-center gap-2"
                disabled={isSubmitting || !formDepartmentId}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the designation from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2">
            <AlertDialogCancel className="h-10 rounded-[20px] [corner-shape:squircle] cursor-pointer" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-[20px] [corner-shape:squircle] px-5 cursor-pointer flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
