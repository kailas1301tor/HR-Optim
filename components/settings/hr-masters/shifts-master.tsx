// components/settings/hr-masters/shifts-master.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
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
import { Plus, Trash2, Edit3, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useShiftsMaster } from './useShiftsMaster'
import type { FrontendShift } from '@/services/shift-service'

interface ShiftsMasterProps {
  shifts: FrontendShift[]
  isLoading: boolean
  onRefresh: () => Promise<void>
}

export function ShiftsMaster({ shifts, isLoading, onRefresh }: ShiftsMasterProps) {
  const {
    isShiftModalOpen,
    setIsShiftModalOpen,
    editingShift,
    isSubmitting,
    shiftName,
    setShiftName,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    shiftStandardHours,
    setShiftStandardHours,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveShift,
    handleDeleteShift,
  } = useShiftsMaster({ onRefresh })

  return (
    <>
      <Card className="bg-card/40 backdrop-blur border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Shifts</CardTitle>
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
            </div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400">No shifts found.</div>
          ) : (
            shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">{shift.name}</span>
                  <span className="text-xs text-slate-400">
                    {shift.startTime} – {shift.endTime} | {shift.standardWorkHours} hrs
                  </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => handleOpenEdit(shift)}
                    aria-label={`Edit ${shift.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => setDeleteTarget(shift)}
                    aria-label={`Delete ${shift.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Shift Dialog */}
      <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
        <DialogContent className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg font-sans">
              {editingShift ? 'Edit Shift' : 'Add Shift'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              {editingShift ? 'Update the shift configuration below.' : 'Configure a new shift schedule.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveShift} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shift Name</Label>
                <Input
                  id="shift-name"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  placeholder="e.g. MORNING"
                  className="bg-midnight border-border rounded-xl text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift-standard-hours" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Standard Work Hours</Label>
                <Input
                  id="shift-standard-hours"
                  type="number"
                  step="0.5"
                  value={shiftStandardHours}
                  onChange={(e) => setShiftStandardHours(e.target.value)}
                  className="bg-midnight border-border rounded-xl text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift-start" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Start Time</Label>
                <Input
                  id="shift-start"
                  type="time"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                  className="bg-midnight border-border rounded-xl text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift-end" className="text-xs font-semibold uppercase tracking-wider text-slate-400">End Time</Label>
                <Input
                  id="shift-end"
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                  className="bg-midnight border-border rounded-xl text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border/40">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer" disabled={isSubmitting}>Cancel</Button>
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

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-md bg-card border border-border/80 rounded-2xl p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cloud font-semibold text-lg font-sans">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm">
              This action cannot be undone. This will permanently delete the &quot;{deleteTarget?.name}&quot; shift from the database.
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
                handleDeleteShift()
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
