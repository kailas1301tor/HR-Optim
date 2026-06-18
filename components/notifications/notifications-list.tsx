// components/notifications/notifications-list.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell, Check, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CommonErrorState } from '@/components/common'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { notificationService } from '@/services/notification-service'
import type { Notification } from '@/types/notification'

export function NotificationsList(): React.JSX.Element {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [reloadToken, setReloadToken] = useState(0)

  const loadNotifications = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setStatus('loading')
    try {
      const data = await notificationService.getNotifications(signal)
      setNotifications(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadNotifications(controller.signal)
    return () => controller.abort()
  }, [reloadToken, loadNotifications])

  const handleMarkRead = async (id: number): Promise<void> => {
    const success = await notificationService.markAsRead(id)
    if (success) {
      toast.success('Notification marked as read')
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } else {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleRetry = (): void => {
    setReloadToken((t) => t + 1)
  }

  if (status === 'error') {
    return (
      <CommonErrorState
        title="Could not load notifications"
        message="We encountered an issue fetching your notification list. Please check your connection and try again."
        onRetry={handleRetry}
      />
    )
  }

  return (
    <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base text-cloud font-semibold flex items-center gap-2">
          <Bell className="h-4.5 w-4.5 text-violet-glow" />
          Recent Alerts
        </CardTitle>
        <CardDescription className="text-xs">
          A list of your transactional and system event updates
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {status === 'loading' ? (
          <div className="divide-y divide-border/30">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 flex items-start gap-4">
                <Skeleton className={cn('h-9 w-9 rounded-lg shrink-0', uiSkeletonBlock)} />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className={cn('h-3.5 w-1/3 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3 w-3/4 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-2.5 w-24 rounded', uiSkeletonBlock)} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-midnight/80 border border-border/60 flex items-center justify-center mb-4">
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-cloud">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              You are all caught up! No recent alerts found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {notifications.map((n) => {
              const dateText = new Date(n.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <div
                  key={n.id}
                  className={cn(
                    'p-5 flex items-start gap-4 transition-colors relative',
                    !n.is_read && 'bg-violet-core/[0.03]'
                  )}
                >
                  {/* Unread indicator */}
                  {!n.is_read && (
                    <span
                      className="absolute top-5.5 left-5.5 w-2.5 h-2.5 bg-violet-glow rounded-full ring-4 ring-background"
                      title="Unread"
                    />
                  )}

                  {/* Icon container */}
                  <div
                    className={cn(
                      'w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border ml-2',
                      n.is_read
                        ? 'text-slate-400 bg-midnight border-border/40'
                        : 'text-violet-glow bg-violet-core/10 border-violet-core/25'
                    )}
                  >
                    <Info className="w-4.5 h-4.5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pl-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4
                        className={cn(
                          'text-sm font-semibold text-cloud leading-none',
                          !n.is_read && 'text-violet-glow'
                        )}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {dateText}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed break-words">
                      {n.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 rounded-lg border border-border/40 hover:border-violet-core/30 hover:bg-violet-core/10 text-slate-400 hover:text-violet-glow transition-all shrink-0 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
