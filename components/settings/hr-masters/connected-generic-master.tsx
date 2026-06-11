// components/settings/hr-masters/connected-generic-master.tsx
'use client'

import { GenericMasterCard } from './generic-master-card'

interface MasterCrudHookResult {
  items: Array<{ id: number; name: string }>
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
  handleSave: (id: number | null, name: string) => Promise<void>
  handleDelete: (id: number) => Promise<void>
}

interface ConnectedGenericMasterProps {
  title: string
  placeholder: string
  label: string
  useMasterHook: () => MasterCrudHookResult
}

export function ConnectedGenericMaster({
  title,
  placeholder,
  label,
  useMasterHook,
}: ConnectedGenericMasterProps) {
  const { items, isLoading, hasError, reload, handleSave, handleDelete } = useMasterHook()

  return (
    <GenericMasterCard
      title={title}
      items={items}
      isLoading={isLoading}
      hasError={hasError}
      onRetry={reload}
      onSave={handleSave}
      onDelete={handleDelete}
      placeholder={placeholder}
      label={label}
    />
  )
}
