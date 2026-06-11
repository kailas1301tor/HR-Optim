// components/assets/assets-toolbar.tsx
'use client'

import { Download, Plus } from 'lucide-react'
import { CommonListToolbar } from '@/components/common'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { AssetDropdowns } from '@/types/asset'

interface AssetsToolbarProps {
  localSearch: string
  onSearchChange: (query: string) => void
  statusFilter: string
  typeFilter: string
  dropdowns: AssetDropdowns | null
  onStatusChange: (val: string) => void
  onTypeChange: (val: string) => void
  onAddAsset: () => void
  onExport?: () => void
  isExporting?: boolean
}

export function AssetsToolbar({
  localSearch,
  onSearchChange,
  statusFilter,
  typeFilter,
  dropdowns,
  onStatusChange,
  onTypeChange,
  onAddAsset,
  onExport,
  isExporting = false,
}: AssetsToolbarProps) {
  return (
    <CommonListToolbar
      searchQuery={localSearch}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search assets..."
      searchAriaLabel="Search assets"
      filters={
        <>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className={cn('w-full sm:w-40 text-xs', uiSelect)} aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              {dropdowns?.asset_status.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className={cn('w-full sm:w-40 text-xs', uiSelect)} aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border text-xs">
              <SelectItem value="all">All Categories</SelectItem>
              {dropdowns?.asset_types.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      actions={
        <>
          {onExport ? (
            <Button
              type="button"
              variant="outline"
              className={cn(uiOutlineBtn, 'gap-2 text-xs flex-1 sm:flex-none')}
              onClick={onExport}
              disabled={isExporting}
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting…' : 'Export'}
            </Button>
          ) : null}
          <PrimaryButton type="button" onClick={onAddAsset} className="gap-2 text-xs flex-1 sm:flex-none">
            <Plus className="w-4 h-4" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Asset</span>
          </PrimaryButton>
        </>
      }
    />
  )
}
