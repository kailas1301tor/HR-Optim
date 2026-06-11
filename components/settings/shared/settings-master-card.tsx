// components/settings/shared/settings-master-card.tsx
'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Plus } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'
import type { SettingsMasterItem } from '@/types/settings'
import { SettingsListRow } from './settings-list-row'

export type { SettingsMasterItem }

interface SettingsMasterCardProps {
  title: string
  items: SettingsMasterItem[]
  isLoading: boolean
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
  onAdd: () => void
  onEdit: (item: SettingsMasterItem) => void
  onDelete: (item: SettingsMasterItem) => void
  renderActions: (item: SettingsMasterItem) => ReactNode
  headerExtra?: ReactNode
  selectedId?: number
  onSelect?: (item: SettingsMasterItem) => void
  className?: string
}

export function SettingsMasterCard({
  title,
  items,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onAdd,
  renderActions,
  headerExtra,
  selectedId,
  onSelect,
  className,
}: SettingsMasterCardProps) {
  return (
    <div className={cn(uiCard, 'p-0 overflow-hidden', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-border/40">
        <h3 className="text-base text-cloud font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {headerExtra}
          <PrimaryButton type="button" onClick={onAdd} className="gap-1.5 text-xs h-9">
            <Plus className="w-3.5 h-3.5" />
            Add
          </PrimaryButton>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={cn('h-12 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          ))
        ) : items.length === 0 ? (
          <CommonEmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            className="py-10 shadow-none border-0 bg-transparent"
            actions={
              <PrimaryButton type="button" onClick={onAdd} className="gap-1.5 text-xs h-9">
                <Plus className="w-3.5 h-3.5" />
                Add first item
              </PrimaryButton>
            }
          />
        ) : (
          items.map((item) => (
            <SettingsListRow
              key={item.id}
              label={
                <div>
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              }
              actions={renderActions(item)}
              isSelected={selectedId === item.id}
              onClick={onSelect ? () => onSelect(item) : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
}
