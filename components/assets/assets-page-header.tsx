// components/assets/assets-page-header.tsx
'use client'

import { Plus } from 'lucide-react'
import { CommonPageHeader } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'

interface AssetsPageHeaderProps {
  onAddAsset: () => void
}

export function AssetsPageHeader({ onAddAsset }: AssetsPageHeaderProps) {
  return (
    <CommonPageHeader
      title="Assets"
      subtitle="Track and manage company assets and equipment"
      action={
        <PrimaryButton onClick={onAddAsset} className="gap-2 w-full sm:w-auto hidden sm:inline-flex">
          <Plus className="w-4 h-4" />
          Add Asset
        </PrimaryButton>
      }
    />
  )
}
