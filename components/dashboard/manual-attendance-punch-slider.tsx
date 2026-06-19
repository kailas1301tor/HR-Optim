// components/dashboard/manual-attendance-punch-slider.tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion'
import { ChevronRight, Loader2, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Matches track `p-1` — gap on all four sides must stay equal */
const TRACK_INSET = 4
const THRESHOLD_RATIO = 0.82

interface ManualAttendancePunchSliderProps {
  mode: 'in' | 'out'
  disabled?: boolean
  isLoading?: boolean
  onComplete: () => void
}

export function ManualAttendancePunchSlider({
  mode,
  disabled = false,
  isLoading = false,
  onComplete,
}: ManualAttendancePunchSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackWidth, setTrackWidth] = useState(0)
  const [thumbSize, setThumbSize] = useState(0)
  const x = useMotionValue(0)

  const maxDrag = Math.max(trackWidth - thumbSize - TRACK_INSET * 2, 0)
  const labelOpacity = useTransform(x, [0, maxDrag * 0.35], [1, 0.15])
  const fillWidth = useTransform(x, (latest) => latest + thumbSize + TRACK_INSET * 2)
  const thumbScale = useTransform(x, [0, maxDrag * 0.5, maxDrag], [1, 1.03, 1.06])

  const isCheckIn = mode === 'in'
  const label = isCheckIn ? 'Slide to Check In' : 'Slide to Check Out'
  const Icon = isCheckIn ? LogIn : LogOut

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateMetrics = () => {
      setTrackWidth(track.offsetWidth)
      // Inner height after p-1 padding — thumb is a perfect square filling that space
      setThumbSize(track.clientHeight - TRACK_INSET * 2)
    }

    updateMetrics()
    const observer = new ResizeObserver(updateMetrics)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    animate(x, 0, { type: 'spring', stiffness: 380, damping: 32 })
  }, [mode, x])

  const resetThumb = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 420, damping: 28, mass: 0.8 })
  }, [x])

  const completeSlide = useCallback(() => {
    animate(x, maxDrag, {
      type: 'spring',
      stiffness: 320,
      damping: 26,
      mass: 0.7,
    })
    onComplete()
    window.setTimeout(resetThumb, 500)
  }, [maxDrag, onComplete, resetThumb, x])

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled || isLoading || maxDrag <= 0) {
        resetThumb()
        return
      }

      const currentX = x.get()
      const velocityBoost = info.velocity.x > 400 ? maxDrag * 0.15 : 0

      if (currentX + velocityBoost >= maxDrag * THRESHOLD_RATIO) {
        completeSlide()
        return
      }

      resetThumb()
    },
    [completeSlide, disabled, isLoading, maxDrag, resetThumb, x],
  )

  return (
    <div
      ref={trackRef}
      className={cn(
        'relative box-border h-14 w-full overflow-hidden rounded-full border p-1 select-none',
        isCheckIn
          ? cn(
              'border-lime-500/30 bg-lime-400/10 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]',
              'dark:border-lime-400/25 dark:bg-lime-950/30 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
            )
          : cn(
              'border-red-400/30 bg-red-50 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]',
              'dark:border-red-400/25 dark:bg-red-950/30 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
            ),
        (disabled || isLoading) && 'pointer-events-none opacity-60',
      )}
      aria-hidden={disabled || isLoading}
    >
      {/* Progress fill — full track height, no vertical gap */}
      <motion.div
        style={{ width: fillWidth }}
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 h-full rounded-full transition-colors duration-300',
          isCheckIn
            ? cn(
                'bg-gradient-to-r from-lime-400/45 via-lime-300/25 to-transparent',
                'dark:from-lime-500/30 dark:via-lime-400/20',
              )
            : cn(
                'bg-gradient-to-r from-red-400/35 via-red-300/20 to-transparent',
                'dark:from-red-500/30 dark:via-red-400/20',
              ),
        )}
      />

      {/* Shimmer label */}
      <motion.span
        style={{ opacity: labelOpacity }}
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center px-14 text-sm font-semibold tracking-wide',
          isCheckIn
            ? 'text-lime-800 dark:text-lime-200/90'
            : 'text-red-800 dark:text-red-200/90',
        )}
      >
        <motion.span
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.span>
      </motion.span>

      {/* Trailing chevrons */}
      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            animate={{ opacity: [0.15, 0.55, 0.15], x: [0, 2, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.18,
            }}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4',
                isCheckIn
                  ? 'text-lime-600/70 dark:text-lime-300/70'
                  : 'text-red-500/70 dark:text-red-300/70',
              )}
              aria-hidden
            />
          </motion.span>
        ))}
      </div>

      {/* Draggable thumb — inset matches track p-1 on all sides */}
      {thumbSize > 0 ? (
        <motion.button
          type="button"
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.05}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 28 }}
          style={{
            x,
            scale: thumbScale,
            width: thumbSize,
            height: thumbSize,
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
          whileTap={{ scale: 0.98 }}
          disabled={disabled || isLoading}
          aria-label={label}
          className={cn(
            'absolute left-1 top-1 z-10 flex cursor-grab items-center justify-center rounded-full shadow-lg',
            'transition-shadow duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-core/60 focus-visible:ring-offset-0',
            'active:cursor-grabbing',
            isCheckIn
              ? cn(
                  'bg-gradient-to-br from-lime-400 to-lime-500 text-lime-950 shadow-lime-500/25',
                  'dark:from-lime-300 dark:to-lime-500 dark:shadow-lime-400/30',
                )
              : cn(
                  'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/25',
                  'dark:from-red-400 dark:to-red-600 dark:shadow-red-500/35',
                ),
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Icon className="h-5 w-5" aria-hidden strokeWidth={2.25} />
          )}
        </motion.button>
      ) : null}
    </div>
  )
}
