// components/employees/profile/personal/assigned-assets-section.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Package } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'
import { assignedAssetsService, type AssignedAssetRecord } from '@/services/assigned-assets-service'

interface AssignedAssetsSectionProps {
  employeeId: number
}

export function AssignedAssetsSection({ employeeId }: AssignedAssetsSectionProps) {
  const [assets, setAssets] = useState<AssignedAssetRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      try {
        const result = await assignedAssetsService.getByEmployee(employeeId, controller.signal)
        if (fetchId !== fetchIdRef.current) return
        setAssets(result)
      } catch {
        if (fetchId !== fetchIdRef.current) return
        setAssets([])
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [employeeId])

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Assigned Assets
      </h3>
      <div className="bg-card border border-border/60 rounded-[24px] [corner-shape:squircle] p-4">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading assets…</p>
        ) : assets.length === 0 ? (
          <CommonEmptyState icon={Package} title="No assigned assets" description="This employee has no assets assigned." />
        ) : (
          <ul className="space-y-3">
            {assets.map((asset) => (
              <li key={asset.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[16px] [corner-shape:squircle] bg-violet-core/15 flex items-center justify-center">
                  <Package className="w-4 h-4 text-violet-glow" />
                </div>
                <div>
                  <p className="text-sm font-medium text-cloud">{asset.name ?? `Asset #${asset.id}`}</p>
                  <p className="text-xs text-slate-400">
                    {[asset.asset_tag, asset.asset_type, asset.status].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
