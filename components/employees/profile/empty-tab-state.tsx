// components/employees/profile/empty-tab-state.tsx
'use client'

import { Inbox } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'

interface EmptyTabStateProps {
  title: string
  description: string
}

export function EmptyTabState({ title, description }: EmptyTabStateProps) {
  return (
    <CommonEmptyState
      icon={Inbox}
      title={title}
      description={description}
      className="py-16 shadow-none border-0 bg-transparent"
    />
  )
}
