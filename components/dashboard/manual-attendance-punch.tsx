// components/dashboard/manual-attendance-punch.tsx
'use client'

import { Clock } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { CommonErrorBanner } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiCard, uiOutlineBtn } from '@/lib/ui/design-system'
import { ManualAttendancePunchSlider } from './manual-attendance-punch-slider'
import { useManualAttendancePunch } from './useManualAttendancePunch'

interface ManualAttendancePunchProps {
  className?: string
}

export function ManualAttendancePunch({ className }: ManualAttendancePunchProps) {
  const {
    isVisible,
    isPunchIn,
    isPunching,
    locationError,
    checkoutConfirmOpen,
    setCheckoutConfirmOpen,
    handleSlideComplete,
    handleCheckoutConfirm,
    handleFallbackPunch,
    clearLocationError,
  } = useManualAttendancePunch()

  if (!isVisible) return null

  const mode = isPunchIn ? 'out' : 'in'
  const statusLabel = isPunchIn ? 'Checked In' : 'Not Checked In'
  const statusDescription = isPunchIn
    ? 'You are currently checked in. Slide to check out when your shift ends.'
    : 'Slide to check in and start your work day.'

  const handleCheckoutDialogChange = (open: boolean) => {
    if (!open && !isPunching) {
      setCheckoutConfirmOpen(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          uiCard,
          'overflow-hidden p-5 sm:p-6 animate-in fade-in duration-300',
          isPunchIn
            ? cn(
                'border-lime-400/20 bg-gradient-to-br from-lime-400/10 via-card to-card',
                'dark:border-lime-400/15 dark:from-lime-400/[0.04]',
              )
            : 'border-border/80',
          className,
        )}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Clock
                className={cn(
                  'h-4 w-4 shrink-0',
                  isPunchIn
                    ? 'text-lime-600 dark:text-lime-400'
                    : 'text-violet-core dark:text-violet-glow',
                )}
                aria-hidden
              />
              <h2 className="text-sm font-semibold text-cloud">Manual Attendance</h2>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  isPunchIn
                    ? cn(
                        'border border-lime-500/35 bg-lime-400/15 text-lime-800',
                        'dark:border-lime-400/30 dark:text-lime-300',
                      )
                    : 'border border-border/60 bg-muted text-muted-foreground',
                )}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground md:line-clamp-2">{statusDescription}</p>
          </div>

          <div className="w-full shrink-0 overflow-hidden md:w-[320px] lg:w-[360px]">
            <ManualAttendancePunchSlider
              mode={mode}
              disabled={isPunching}
              isLoading={isPunching}
              onComplete={handleSlideComplete}
            />
          </div>
        </div>

        {locationError ? (
          <div className="mt-3 md:mt-4">
            <CommonErrorBanner
              message={locationError}
              onRetry={() => {
                clearLocationError()
                handleFallbackPunch()
              }}
            />
          </div>
        ) : null}
      </div>

      <AlertDialog open={checkoutConfirmOpen} onOpenChange={handleCheckoutDialogChange}>
        <AlertDialogContent className="max-w-md rounded-[32px] [corner-shape:squircle] border border-border/80 bg-card p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-cloud">
              Confirm Check Out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to check out? Your location will be recorded for this punch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 border-t border-border/40 pt-4">
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                className={cn(uiOutlineBtn, 'rounded-full text-xs')}
                disabled={isPunching}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              onClick={() => void handleCheckoutConfirm()}
              className="flex h-10 items-center gap-2 rounded-full bg-red-500 px-5 text-xs font-semibold text-white hover:bg-red-400"
              disabled={isPunching}
            >
              {isPunching ? 'Checking out…' : 'Confirm Check Out'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
