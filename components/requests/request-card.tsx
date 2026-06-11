// components/requests/request-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Clock, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { uiSquircleLg, uiSquircleMd, uiSquircleSm } from '@/lib/ui/design-system'
import type { Request } from './requests-constants'
import { typeConfig, statusConfig } from './requests-constants'

const actionBtnClass =
  'h-10 w-full text-xs font-semibold tracking-tight shadow-sm transition-all active:scale-[0.98]'

interface RequestCardProps {
  request: Request
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onApprove: () => void
  onReject: () => void
}

export function RequestCard({
  request,
  index,
  isExpanded,
  onToggleExpand,
  onApprove,
  onReject,
}: RequestCardProps) {
  const type = typeConfig[request.type]
  const status = statusConfig[request.status]
  const TypeIcon = type.icon
  const isPending = request.status === 'pending'

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'group relative flex flex-col overflow-hidden',
        uiSquircleLg,
        'border border-border/45 bg-card/92 backdrop-blur-xl',
        'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_rgba(15,23,42,0.06)]',
        'dark:shadow-[0_1px_1px_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.35)]',
        'transition-[box-shadow,border-color,transform] duration-300 ease-out',
        'hover:-translate-y-0.5',
        type.hoverBorder
      )}
    >
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-[20px] [corner-shape:squircle] ring-1 ring-inset',
                  type.iconSurface
                )}
              >
                <TypeIcon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {type.label}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-tight tracking-tight text-foreground line-clamp-2">
              {request.title}
            </h3>
          </div>
          <CommonStatusBadge variant={request.status} label={status.label} />
        </div>

        <div
          className={cn(
            'overflow-hidden bg-muted/35 ring-1 ring-border/35 dark:bg-white/[0.03]',
            uiSquircleMd
          )}
        >
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Avatar className="h-8 w-8 shrink-0 ring-1 ring-border/30">
              <AvatarImage src={request.requester.avatar} alt="" />
              <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-[10px] font-semibold text-white">
                {request.requester.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight text-foreground">
                {request.requester.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {request.requester.department && request.requester.department !== '—'
                  ? `${request.requester.department} · `
                  : ''}
                <span className="font-mono text-violet-glow/90">{request.displayId}</span>
              </p>
            </div>
          </div>

          {request.description ? (
            <>
              <div className="h-px bg-border/50" aria-hidden />
              <p className="px-3 py-2 text-xs leading-snug text-muted-foreground line-clamp-2">
                {request.description}
              </p>
            </>
          ) : null}
        </div>

        <div className="space-y-2 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              {request.submittedAt}
            </span>
            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-0.5 rounded-[16px] [corner-shape:squircle] px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              aria-expanded={isExpanded}
              aria-label="View request timeline"
            >
              Timeline
              <ChevronDown
                className={cn('h-3 w-3 transition-transform duration-200', isExpanded && 'rotate-180')}
              />
            </button>
          </div>

          {isPending ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onReject}
                aria-label="Reject request"
                className={cn(
                  actionBtnClass,
                  uiSquircleSm,
                  'border border-border/60 bg-white text-foreground',
                  'shadow-[0_2px_10px_rgba(15,23,42,0.06)]',
                  'hover:bg-muted/40 hover:text-foreground',
                  'dark:bg-card dark:hover:bg-muted/30'
                )}
              >
                Reject
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onApprove}
                aria-label="Approve request"
                className={cn(
                  actionBtnClass,
                  uiSquircleSm,
                  'bg-[#34C759] text-white hover:bg-[#2DB84E] hover:text-white',
                  'shadow-[0_4px_16px_rgba(52,199,89,0.22)]'
                )}
              >
                Approve
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="border-t border-border/40 bg-muted/20 px-4 py-3 dark:bg-white/[0.02]"
        >
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Approval timeline
          </p>
          <div className="relative space-y-3.5 pl-6">
            {request.timeline.map((step, i) => {
              const isLast = i === request.timeline.length - 1
              return (
                <div key={step.step} className="relative">
                  {!isLast && (
                    <div
                      className={cn(
                        'absolute -left-[18px] top-4 h-[calc(100%+6px)] w-px',
                        step.status === 'completed' ? 'bg-lime-500/40' : 'bg-border/80'
                      )}
                      aria-hidden
                    />
                  )}
                  <div className="absolute -left-6 top-0.5">
                    <div
                      className={cn(
                        'h-2.5 w-2.5 rounded-full ring-2 ring-card',
                        step.status === 'completed'
                          ? 'bg-lime-500'
                          : step.status === 'current'
                            ? 'bg-violet-core'
                            : 'bg-muted-foreground/35'
                      )}
                    />
                  </div>
                  <div>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                      )}
                    >
                      {step.step}
                    </p>
                    {step.date ? (
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{step.date}</p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.article>
  )
}
