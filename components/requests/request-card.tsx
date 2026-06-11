// components/requests/request-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Clock, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommonStatusBadge } from '@/components/common'
import { uiCardInteractive, uiSquircleMd } from '@/lib/ui/design-system'
import type { Request } from './requests-constants'
import { typeConfig, statusConfig } from './requests-constants'
import { RequestActionButtons } from './request-action-buttons'

interface RequestCardProps {
  request: Request
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onApprove: () => void
  onReject: () => void
  canManage?: boolean
}

export function RequestCard({
  request,
  index,
  isExpanded,
  onToggleExpand,
  onApprove,
  onReject,
  canManage = false,
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
        uiCardInteractive,
        'group relative flex flex-col overflow-hidden p-4 border-l-2',
        status.borderColor,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-[16px] [corner-shape:squircle] ring-1 ring-inset',
                  type.iconSurface
                )}
              >
                <TypeIcon className="h-3 w-3" aria-hidden />
              </span>
              <span className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {type.label}
              </span>
            </div>
            <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
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
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border/30">
              <AvatarImage src={request.requester.avatar} alt="" />
              <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-[9px] font-semibold text-white">
                {request.requester.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium leading-tight text-foreground">
                {request.requester.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
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
              <p className="px-2.5 py-1.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                {request.description}
              </p>
            </>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
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

          {isPending && canManage ? (
            <RequestActionButtons onReject={onReject} onApprove={onApprove} />
          ) : null}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="border-t border-border/40 bg-muted/20 px-3 py-2 dark:bg-white/[0.02]"
        >
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Approval timeline
          </p>
          <div className="relative space-y-2.5 pl-6">
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
