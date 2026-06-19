// components/notifications/notifications-list.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Check, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'
import { notificationService } from '@/services/notification-service'
import { NotificationsSkeleton } from './notifications-skeleton'
import { useNotificationsList } from './useNotificationsList'

export function NotificationsList(): React.JSX.Element {
  const {
    notifications,
    isLoading,
    hasError,
    errorMessage,
    reload,
    markNotificationRead,
  } = useNotificationsList()

  const handleMarkRead = async (id: number): Promise<void> => {
    const success = await notificationService.markAsRead(id)
    if (success) {
      toast.success('Notification marked as read')
      markNotificationRead(id)
    } else {
      toast.error('Failed to mark notification as read')
    }
  }

  if (isInitialDataLoading(isLoading, notifications.length, hasError)) {
    return <NotificationsSkeleton />
  }

  if (hasError) {
    return (
      <CommonErrorState
        title="Could not load notifications"
        message={errorMessage ?? 'We encountered an issue fetching your notification list. Please check your connection and try again.'}
        onRetry={reload}
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
        {notifications.length === 0 ? (
          <CommonEmptyState
            icon={Bell}
            title="No notifications"
            description="You are all caught up! No recent alerts found."
            className="border-0 bg-transparent shadow-none py-12"
          />
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
                    !n.is_read && 'bg-violet-core/[0.03]',
                  )}
                >
                  {!n.is_read && (
                    <span
                      className="absolute top-5.5 left-5.5 w-2.5 h-2.5 bg-violet-glow rounded-full ring-4 ring-background"
                      title="Unread"
                    />
                  )}

                  <div
                    className={cn(
                      'w-9 h-9 flex items-center justify-center shrink-0 rounded-lg border ml-2',
                      n.is_read
                        ? 'text-slate-400 bg-midnight border-border/40'
                        : 'text-violet-glow bg-violet-core/10 border-violet-core/25',
                    )}
                  >
                    <Info className="w-4.5 h-4.5" />
                  </div>

                  <div className="min-w-0 flex-1 pl-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4
                        className={cn(
                          'text-sm font-semibold text-cloud leading-none',
                          !n.is_read && 'text-violet-glow',
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
