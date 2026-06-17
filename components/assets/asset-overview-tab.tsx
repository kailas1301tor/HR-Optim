// components/assets/asset-overview-tab.tsx
'use client'

import { Calendar, DollarSign, Clock, MapPin, Building, Info, Settings, Shield, User } from 'lucide-react'
import type { BackendAsset } from '@/types/asset'
import { cn } from '@/lib/utils'
import { getAssetAssignmentDisplay } from '@/lib/helpers/asset-assignment'

interface AssetOverviewTabProps {
  asset: BackendAsset
}

export function AssetOverviewTab({ asset }: AssetOverviewTabProps) {
  const assignment = getAssetAssignmentDisplay(asset)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCost = (costStr: string | null) => {
    if (!costStr) return 'N/A'
    const value = parseFloat(costStr)
    return isNaN(value) ? 'N/A' : `AED ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
      {/* Specifications & Details Card */}
      <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 md:col-span-2 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-cloud flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-violet-glow" /> Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-midnight/30 border border-border/40 p-4 rounded-[20px] [corner-shape:squircle]">
            {[
              { label: 'Asset Name', value: asset.name },
              { label: 'Serial Number', value: asset.serial_number || 'N/A', mono: true },
              { label: 'Asset Type', value: asset.asset_type || 'N/A' },
              { label: 'Category', value: asset.asset_category || 'N/A' },
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col justify-center py-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{field.label}</span>
                <span className={cn("text-sm font-medium text-cloud mt-0.5", field.mono && "font-mono text-violet-glow")}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cloud flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-violet-glow" /> Assignment & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-midnight/30 border border-border/40 p-4 rounded-[20px] [corner-shape:squircle]">
            <div className="flex items-start gap-2.5">
              {assignment?.kind === 'department' ? (
                <Building className="w-4 h-4 text-violet-glow mt-1" />
              ) : (
                <User className="w-4 h-4 text-violet-glow mt-1" />
              )}
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {assignment?.kind === 'department' ? 'Assigned Department' : 'Assigned To'}
                </span>
                <p className="text-sm font-medium text-cloud mt-0.5">
                  {assignment?.label || 'Unassigned'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-violet-glow mt-1" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Department</span>
                <p className="text-xs font-semibold text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2.5 py-0.5 rounded-full inline-block mt-1">
                  {asset.department || 'UNASSIGNED'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-slate-500 mt-1" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Location / Desk</span>
                <p className="text-sm font-medium text-cloud mt-0.5">
                  {asset.location || 'N/A'} {asset.sub_location ? `— ${asset.sub_location}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financials & Lifespan Card */}
      <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-cloud flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-violet-glow" /> Financial Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-midnight/30 border border-border/40 p-3.5 rounded-[20px] [corner-shape:squircle]">
              <span className="text-xs text-slate-400 font-medium">Purchase Cost</span>
              <span className="text-sm font-bold font-mono text-cloud">{formatCost(asset.purchase_cost)}</span>
            </div>
            <div className="flex justify-between items-center bg-midnight/30 border border-border/40 p-3.5 rounded-[20px] [corner-shape:squircle]">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Purchase Date
              </span>
              <span className="text-xs font-semibold text-cloud">{formatDate(asset.purchase_date)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-cloud flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-violet-glow" /> Warranty & Service
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-midnight/30 border border-border/40 p-3.5 rounded-[20px] [corner-shape:squircle]">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Warranty Limit
              </span>
              <span className="text-sm font-semibold text-cloud">
                {asset.warranty_period ? `${asset.warranty_period} Months` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-midnight/30 border border-border/40 p-3.5 rounded-[20px] [corner-shape:squircle]">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Service Due
              </span>
              <span className="text-xs font-semibold text-cloud">{formatDate(asset.service_due_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Timestamps Panel */}
      <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-4 md:col-span-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>System Record ID: {asset.id}</span>
        </div>
        <div className="flex gap-4">
          <span>Created At: {new Date(asset.created_at).toLocaleString()}</span>
          <span>Last Updated: {new Date(asset.updated_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
