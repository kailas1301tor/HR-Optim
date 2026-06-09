// components/documents/documents-toolbar.tsx
'use client'

import { Download, Upload } from 'lucide-react'
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

interface DocumentsToolbarProps {
  tab: 'employee' | 'company'
  localSearch: string
  setLocalSearch: (val: string) => void
  categoryFilter: string
  onCategoryChange: (val: string) => void
  categories: Array<{ id: number; name: string }>
  onExport: () => void
  onUploadClick: () => void
}

export function DocumentsToolbar({
  tab,
  localSearch,
  setLocalSearch,
  categoryFilter,
  onCategoryChange,
  categories,
  onExport,
  onUploadClick,
}: DocumentsToolbarProps) {
  return (
    <CommonListToolbar
      searchQuery={localSearch}
      onSearchChange={setLocalSearch}
      searchPlaceholder={`Search ${tab === 'employee' ? 'employee' : 'company'} documents...`}
      searchAriaLabel="Search documents"
      filters={
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className={cn('w-full sm:w-44 text-xs', uiSelect)} aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border text-xs">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className={cn(uiOutlineBtn, 'gap-2 text-xs flex-1 sm:flex-none')}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <PrimaryButton type="button" onClick={onUploadClick} className="gap-2 text-xs flex-1 sm:flex-none">
            <Upload className="w-4 h-4" />
            <span className="sm:hidden">Upload</span>
            <span className="hidden sm:inline">Upload Document</span>
          </PrimaryButton>
        </>
      }
    />
  )
}
