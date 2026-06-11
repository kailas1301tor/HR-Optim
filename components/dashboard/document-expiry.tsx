'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonEmptyState } from '@/components/common'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import type { DashboardDocumentExpiryItem } from '@/types/dashboard'

type DocStatus = 'expired' | 'expiring' | 'valid'

function mapDocStatus(status: string, daysLeft: number): DocStatus {
  if (status.toLowerCase().includes('expired') || daysLeft < 0) return 'expired'
  if (status.toLowerCase().includes('expiring') || daysLeft <= 30) return 'expiring'
  return 'valid'
}

const statusConfig = {
  expired: {
    color: 'bg-danger-bg text-danger-text',
    barColor: 'bg-red-500',
  },
  expiring: {
    color: 'bg-warning-bg text-warning-text',
    barColor: 'bg-amber-500',
  },
  valid: {
    color: 'bg-success-bg text-success-text',
    barColor: 'bg-lime-400',
  },
}

interface DocumentExpiryTimelineProps {
  items: DashboardDocumentExpiryItem[]
  isLoading?: boolean
}

export function DocumentExpiryTimeline({ items, isLoading = false }: DocumentExpiryTimelineProps) {
  const displayItems = items.slice(0, 8)
  const maxDays = Math.max(
    ...displayItems.filter((d) => d.daysLeft > 0).map((d) => d.daysLeft),
    1,
  )

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <Skeleton className={cn('h-64 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  if (displayItems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <h3 className="text-lg font-semibold text-cloud">Document Expiry Timeline</h3>
        <CommonEmptyState icon={FileText} title="No documents" description="No document expiry data available." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-cloud">Document Expiry Timeline</h3>
        <span className="text-xs text-muted-foreground">Upcoming renewals</span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Track document renewals and avoid compliance issues
      </p>

      <div className="space-y-4">
        {displayItems.map((doc, index) => {
          const status = mapDocStatus(doc.status, doc.daysLeft)
          const config = statusConfig[status]
          const barWidth =
            status === 'expired' ? 0 : Math.min((doc.daysLeft / maxDays) * 100, 100)

          return (
            <motion.div
              key={`${doc.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 rounded-[16px] [corner-shape:squircle] bg-midnight flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-cloud truncate">{doc.name}</p>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0',
                        config.color,
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.owner} · <span className="font-mono text-violet-glow">{doc.idNumber}</span>
                    {doc.type ? ` · ${doc.type}` : ''}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-mono text-cloud">
                    {doc.daysLeft < 0 ? `${Math.abs(doc.daysLeft)}d ago` : `${doc.daysLeft}d`}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.expiryDate}</p>
                </div>
              </div>

              <div className="ml-12 h-1.5 bg-midnight rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  className={cn('h-full rounded-full', config.barColor)}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
