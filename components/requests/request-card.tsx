// components/requests/request-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Clock, ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommonStatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import { uiApproveBtn, uiCardInteractive, uiOutlineBtn } from '@/lib/ui/design-system'
import type { Request } from './requests-constants'
import { typeConfig, statusConfig } from './requests-constants'

interface RequestCardProps {
  request: Request
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onApprove: () => void
  onReject: () => void
}

function formatRequesterMeta(request: Request): string {
  const parts = [request.requester.name]
  if (request.requester.department && request.requester.department !== '—') {
    parts.push(request.requester.department)
  }
  parts.push(request.displayId)
  return parts.join(' · ')
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        uiCardInteractive,
        'overflow-hidden border-l-2',
        type.borderColor,
        `bg-gradient-to-r ${type.gradientClass} to-transparent`
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-border/40">
            <AvatarImage src={request.requester.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {request.requester.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={cn('p-2 rounded-xl', type.color)}>
                <TypeIcon className="w-4 h-4" aria-hidden />
              </span>
              <h3 className="text-sm font-semibold text-cloud truncate">{request.title}</h3>
              <CommonStatusBadge variant={request.status} label={status.label} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{formatRequesterMeta(request)}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{request.description}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              {request.submittedAt}
            </div>
            <button
              type="button"
              onClick={onToggleExpand}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cloud transition-colors"
              aria-expanded={isExpanded}
              aria-label="View request timeline"
            >
              <span>Timeline</span>
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform', isExpanded && 'rotate-180')}
              />
            </button>
          </div>

          {request.status === 'pending' && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className={cn(uiOutlineBtn, 'min-h-10 text-xs gap-1.5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30')}
                onClick={onReject}
                aria-label="Reject request"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reject</span>
              </Button>
              <Button
                type="button"
                className={cn(uiApproveBtn, 'text-xs gap-1.5')}
                onClick={onApprove}
                aria-label="Approve request"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Approve</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/60 bg-midnight/40 px-5 py-4"
        >
          <div className="relative pl-6 space-y-4">
            {request.timeline.map((step, i) => {
              const isLast = i === request.timeline.length - 1
              return (
                <div key={step.step} className="relative">
                  {!isLast && (
                    <div
                      className={cn(
                        'absolute left-[-18px] top-5 w-0.5 h-[calc(100%+8px)]',
                        step.status === 'completed' ? 'bg-lime-400/60' : 'bg-slate-700'
                      )}
                      aria-hidden
                    />
                  )}
                  <div className="absolute left-[-24px] top-0.5">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full ring-2 ring-midnight',
                        step.status === 'completed'
                          ? 'bg-lime-400'
                          : step.status === 'current'
                          ? 'bg-violet-core'
                          : 'bg-slate-600'
                      )}
                    />
                  </div>
                  <div>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        step.status === 'pending' ? 'text-slate-500' : 'text-cloud'
                      )}
                    >
                      {step.step}
                    </p>
                    {step.date && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
