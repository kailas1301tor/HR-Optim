// components/settings/department-settings-card.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
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
import { Plus, Trash2, Edit3, Loader2, Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { CommonEmptyState } from '@/components/common'
import { type Department } from '@/services/department-service'
import { useDepartmentSettings } from './useDepartmentSettings'

export function DepartmentSettingsCard() {
  const {
    selectedDeptId,
    departments,
    isLoading,
    isOpen,
    editId,
    formName,
    formDescription,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormDescription,
    setDeleteId,
    setSelectedDeptId,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  } = useDepartmentSettings()

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Departments</CardTitle>
          <button
            onClick={handleOpenAdd}
            className="text-xs font-semibold text-violet-glow hover:text-violet-deep transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className={cn('h-14 w-full rounded-xl', uiSkeletonBlock)} />
              <Skeleton className={cn('h-14 w-full rounded-xl', uiSkeletonBlock)} />
              <Skeleton className={cn('h-14 w-full rounded-xl', uiSkeletonBlock)} />
            </div>
          ) : departments.length === 0 ? (
            <CommonEmptyState
              icon={Building2}
              title="No departments yet"
              description="Add a department to organize your company structure."
              className="py-8 shadow-none border-0 bg-transparent"
            />
          ) : (
            departments.map((dept) => {
              const isSelected = selectedDeptId === String(dept.id)
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(String(dept.id))}
                  className={`flex items-center justify-between border rounded-xl p-3.5 transition-all duration-300 group cursor-pointer ${
                    isSelected
                      ? 'bg-violet-core/10 border-violet-core shadow-[0_0_15px_rgba(139,92,246,0.12)]'
                      : 'bg-midnight border-border/60 hover:border-violet-core/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-sm font-semibold transition-colors duration-200 ${
                      isSelected ? 'text-violet-glow' : 'text-slate-200'
                    }`}>
                      {dept.name}
                    </span>
                    {dept.description && (
                      <p className="text-xs text-slate-400 font-normal leading-relaxed">{dept.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                      onClick={() => handleOpenEdit(dept)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                      onClick={() => setDeleteId(dept.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editId !== null ? 'Edit Department' : 'Add Department'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Department Name
              </Label>
              <Input
                id="dept-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. ENGINEERING"
                className="bg-midnight border-border rounded-xl text-sm"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-desc" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Description
              </Label>
              <Textarea
                id="dept-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Software Development Team"
                className="bg-midnight border-border rounded-xl text-sm min-h-20"
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter className="pt-4 border-t border-border/40">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the department from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2">
            <AlertDialogCancel className="h-10 rounded-xl cursor-pointer" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2"
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
