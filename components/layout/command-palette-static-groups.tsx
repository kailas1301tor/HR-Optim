// components/layout/command-palette-static-groups.tsx
'use client'

import React from 'react'
import { Command } from 'cmdk'
import { ArrowRight, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiSquircleNav } from '@/lib/ui/design-system'

export function SearchLoadingSkeleton() {
  return (
    <div className="px-2 py-3 space-y-4">
      {/* Employees Category Skeleton */}
      <div className="space-y-2">
        <div className="px-2 py-1">
          <div className="h-3 w-16 bg-border/20 rounded skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-border/20 shrink-0 skeleton-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 bg-border/20 rounded skeleton-shimmer" />
            <div className="h-2.5 w-1/2 bg-border/10 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* Requests Category Skeleton */}
      <div className="space-y-2">
        <div className="px-2 py-1">
          <div className="h-3 w-14 bg-border/20 rounded skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-border/20 shrink-0 skeleton-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/2 bg-border/20 rounded skeleton-shimmer" />
            <div className="h-2.5 w-1/4 bg-border/10 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuickActionsGroupProps {
  quickActions: Array<{
    name: string
    icon: LucideIcon
    action: string
  }>
  onSelect: (href: string) => void
}

export function QuickActionsGroup({ quickActions, onSelect }: QuickActionsGroupProps) {
  return (
    <Command.Group heading="Quick Actions" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Quick Actions
      </div>
      {quickActions.map((action) => (
        <Command.Item
          key={action.action}
          value={action.name}
          onSelect={() => onSelect(`/${action.action}`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className={cn('w-8 h-8 bg-midnight flex items-center justify-center', uiSquircleNav)}>
            <action.icon className="w-4 h-4 text-violet-glow" />
          </div>
          <span className="flex-1 text-sm">{action.name}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface AccountGroupProps {
  accountPages: Array<{
    name: string
    icon: LucideIcon
    href: string
    keywords: string[]
  }>
  onSelect: (href: string) => void
}

export function AccountGroup({ accountPages, onSelect }: AccountGroupProps) {
  return (
    <Command.Group heading="Account" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Account
      </div>
      {accountPages.map((page) => (
        <Command.Item
          key={page.href}
          value={`${page.name} ${page.keywords.join(' ')}`}
          onSelect={() => onSelect(page.href)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className={cn('w-8 h-8 bg-midnight flex items-center justify-center', uiSquircleNav)}>
            <page.icon className="w-4 h-4 text-slate-400" />
          </div>
          <span className="flex-1 text-sm">{page.name}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface PagesGroupProps {
  pages: Array<{
    name: string
    icon: LucideIcon
    href: string
    keywords: string[]
  }>
  onSelect: (href: string) => void
}

export function PagesGroup({ pages, onSelect }: PagesGroupProps) {
  return (
    <Command.Group heading="Pages" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Pages
      </div>
      {pages.map((page) => (
        <Command.Item
          key={page.href}
          value={`${page.name} ${page.keywords.join(' ')}`}
          onSelect={() => onSelect(page.href)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className={cn('w-8 h-8 bg-midnight flex items-center justify-center', uiSquircleNav)}>
            <page.icon className="w-4 h-4 text-slate-400" />
          </div>
          <span className="flex-1 text-sm">{page.name}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}
