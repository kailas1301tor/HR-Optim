// components/settings/branch-settings-card.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Trash2, Edit3, Loader2, MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useBranchSettings } from './useBranchSettings'

export function BranchSettingsCard() {
  const {
    branches,
    isLoading,
    isOpen,
    editId,
    formName,
    formAddress,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen,
    setFormName,
    setFormAddress,
    setDeleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  } = useBranchSettings()

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Branches</CardTitle>
          <button
            type="button"
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
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <MapPin className="h-8 w-8 text-slate-500" />
              <p className="text-sm text-slate-400">No branches found.</p>
              <p className="text-xs text-slate-500">Add your first branch to get started.</p>
            </div>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-slate-200">{branch.name}</span>
                  {branch.address && (
                    <p className="text-xs text-slate-400 font-normal">{branch.address}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => handleOpenEdit(branch)}
                    aria-label={`Edit branch ${branch.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => setDeleteId(branch.id)}
                    aria-label={`Delete branch ${branch.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!isSubmitting) setIsOpen(open) }}>
        <DialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editId !== null ? 'Edit Branch' : 'Add Branch'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {editId !== null ? 'Update the branch details below.' : 'Fill in the details to create a new branch.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="branch-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Branch Name
              </Label>
              <Input
                id="branch-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Head Office"
                className="bg-midnight border-border rounded-xl text-sm"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch-address" className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
                Address
              </Label>
              <Textarea
                id="branch-address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="e.g. 123 Main St, Cityville"
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
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the branch from the database.
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
