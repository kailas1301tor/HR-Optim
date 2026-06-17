// components/dashboard/employee-pending-requests.tsx
'use client'

import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonEmptyState } from '@/components/common'
import { uiCard } from '@/lib/ui/design-system'
import type { EmployeePendingRequestItem } from '@/types/dashboard'

interface EmployeePendingRequestsProps {
  items: EmployeePendingRequestItem[]
}

function getStatusBadgeClass(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('approved')) return 'bg-lime-500/10 text-lime-400'
  if (normalized.includes('pending')) return 'bg-amber-500/10 text-amber-400'
  if (normalized.includes('reject')) return 'bg-red-500/10 text-red-400'
  return 'bg-slate-500/10 text-slate-400'
}

function formatSubmittedDate(date: string): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function EmployeePendingRequests({ items }: EmployeePendingRequestsProps) {
  return (
    <div className={cn(uiCard, 'p-6 space-y-4')}>
      <div>
        <h2 className="text-lg font-semibold text-cloud">My Pending Requests</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Requests awaiting review or recently submitted
        </p>
      </div>

      {items.length === 0 ? (
        <CommonEmptyState
          icon={ClipboardList}
          title="No pending requests"
          description="You have no requests awaiting approval."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-xs text-muted-foreground">
                <th className="pb-3 font-semibold">Request Type</th>
                <th className="pb-3 font-semibold">Submitted Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-border/20">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 font-medium text-cloud">{item.type}</td>
                  <td className="py-3.5 text-muted-foreground">
                    {formatSubmittedDate(item.submittedDate)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
                        getStatusBadgeClass(item.status),
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-muted-foreground">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
