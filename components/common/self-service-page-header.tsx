// components/common/self-service-page-header.tsx
'use client'

import type { ReactNode } from 'react'
import { useModuleGate } from '@/lib/permissions/use-module-gate'
import type { ModuleKey } from '@/lib/permissions/module-permissions'
import { CommonPageHeader } from './page-header'

interface SelfServicePageHeaderProps {
  moduleKey: ModuleKey
  title: string
  subtitle?: ReactNode
}

export function SelfServicePageHeader({ moduleKey, title, subtitle }: SelfServicePageHeaderProps) {
  const gate = useModuleGate(moduleKey)

  if (gate.shouldRenderPersonalView) {
    return null
  }

  return <CommonPageHeader title={title} subtitle={subtitle} />
}
