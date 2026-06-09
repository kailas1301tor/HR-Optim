// components/assets/asset-detail-view.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, History, MoreHorizontal, User, RefreshCw, Trash2, Shield, Wrench, Pencil } from 'lucide-react'
import { CommonErrorState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type BackendAsset, type AssetDropdowns } from '@/services/asset-service'
import { useAssetDetail } from './useAssetDetail'
import { AddAssetModal } from './add-asset-modal'

// Tabs
import { AssetOverviewTab } from './asset-overview-tab'
import { AssetHistoryTab } from './asset-history-tab'
import { AssetDocumentsTab } from './asset-documents-tab'
import { AssetAMCTab } from './asset-amc-tab'
import { AssetDisposalTab } from './asset-disposal-tab'
import { AssetDetailSkeleton } from './asset-detail-skeleton'

// Action Dialogs
import { AssignAssetDialog } from './assign-asset-dialog'
import { TransferAssetDialog } from './transfer-asset-dialog'
import { MaintenanceDialog } from './maintenance-dialog'
import { ReturnAssetDialog } from './return-asset-dialog'
import { DisposeAssetDialog } from './dispose-asset-dialog'

// Dropdown primitives
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AssetDetailViewProps {
  assetId: number
}

export function AssetDetailView({ assetId }: AssetDetailViewProps) {
  const router = useRouter()
  const {
    asset,
    dropdowns,
    departments,
    isLoading,
    error,
    isAssignOpen,
    isTransferOpen,
    isMaintenanceOpen,
    isReturnOpen,
    isDisposeOpen,
    isEditOpen,
    activeTab,
    typeConfig,
    statusConfig,
    isDisposed,
    isAssigned,
    inRepair,
    setIsAssignOpen,
    setIsTransferOpen,
    setIsMaintenanceOpen,
    setIsReturnOpen,
    setIsDisposeOpen,
    setIsEditOpen,
    setTab,
    fetchAssetDetails,
  } = useAssetDetail(assetId)

  if (isLoading) {
    return <AssetDetailSkeleton />
  }

  if (error || !asset || !typeConfig || !statusConfig) {
    return (
      <CommonErrorState
        title="Asset Not Found"
        message={error || 'The requested asset records could not be retrieved from the server.'}
        onRetry={() => router.push('/assets')}
        retryLabel="Back to Assets"
      />
    )
  }

  const TypeIcon = typeConfig.icon



  return (
    <div className="space-y-6">
      {/* Back Button & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/assets')}
          className="gap-2 px-0 hover:bg-transparent text-slate-400 hover:text-cloud self-start"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Assets
        </Button>

        {!isDisposed && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:self-auto">
            {!isAssigned && !inRepair && (
              <Button
                onClick={() => setIsAssignOpen(true)}
                className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <User className="h-4 w-4" /> Assign
              </Button>
            )}

            {isAssigned && (
              <Button
                onClick={() => setIsTransferOpen(true)}
                variant="outline"
                className="border-border text-cloud flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" /> Transfer
              </Button>
            )}

            <Button
              onClick={() => setIsEditOpen(true)}
              variant="outline"
              className="border-border text-cloud flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-border">
                  <MoreHorizontal className="h-4 w-4 text-cloud" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-xl">
                {isAssigned && (
                  <DropdownMenuItem
                    onClick={() => setIsAssignOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cloud"
                  >
                    <User className="h-4 w-4" /> Assign Asset
                  </DropdownMenuItem>
                )}
                {!inRepair && (
                  <DropdownMenuItem
                    onClick={() => setIsMaintenanceOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cloud"
                  >
                    <Wrench className="h-4 w-4" /> Schedule Maintenance
                  </DropdownMenuItem>
                )}
                {isAssigned && (
                  <DropdownMenuItem
                    onClick={() => setIsReturnOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-cloud"
                  >
                    <ArrowLeft className="h-4 w-4" /> Return Asset
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setIsDisposeOpen(true)}
                  className="flex items-center gap-2 cursor-pointer text-rose-400 hover:text-rose-300 font-medium"
                >
                  <Trash2 className="h-4 w-4" /> Dispose Asset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Premium Dashboard Summary Panel */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-200">
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-core/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg', typeConfig.color)}>
              <TypeIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-cloud">{asset.name}</h1>
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase', statusConfig.className)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', statusConfig.dotClassName)} />
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs font-mono text-violet-glow mt-1">
                AST-{String(asset.id).padStart(3, '0')} • {asset.asset_type || 'Unknown Type'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Serial Number</p>
              <p className="text-sm font-semibold font-mono text-cloud mt-0.5">{asset.serial_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Department</p>
              <p className="text-xs font-semibold text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2.5 py-0.5 rounded-full inline-block mt-1 max-w-[140px] truncate uppercase">
                {asset.department || 'Unassigned'}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Current Location</p>
              <p className="text-sm font-semibold text-cloud mt-0.5 truncate max-w-[180px]">
                {asset.location || 'N/A'} {asset.sub_location ? `(${asset.sub_location})` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/60 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'history', label: 'History Logs', icon: History },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'amc', label: 'AMC Contracts', icon: Shield },
          { id: 'disposal', label: 'Disposal Record', icon: Trash2 },
        ].map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap outline-none',
                isActive
                  ? 'border-violet-core text-violet-glow bg-violet-core/5'
                  : 'border-transparent text-slate-400 hover:text-cloud hover:border-slate-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Render active Tab */}
      <div className="min-h-[250px] transition-all duration-200">
        {activeTab === 'overview' && <AssetOverviewTab asset={asset} />}
        {activeTab === 'history' && <AssetHistoryTab assetId={assetId} />}
        {activeTab === 'documents' && <AssetDocumentsTab assetId={assetId} dropdowns={dropdowns} />}
        {activeTab === 'amc' && <AssetAMCTab assetId={assetId} dropdowns={dropdowns} />}
        {activeTab === 'disposal' && <AssetDisposalTab assetId={assetId} dropdowns={dropdowns} />}
      </div>

      {/* Actions Dialog modals */}
      <AddAssetModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchAssetDetails}
        editAsset={asset}
        dropdowns={dropdowns}
        departments={departments}
      />
      <AssignAssetDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        assetId={assetId}
        onSuccess={fetchAssetDetails}
      />
      <TransferAssetDialog
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        assetId={assetId}
        onSuccess={fetchAssetDetails}
      />
      <MaintenanceDialog
        open={isMaintenanceOpen}
        onOpenChange={setIsMaintenanceOpen}
        assetId={assetId}
        dropdowns={dropdowns}
        onSuccess={fetchAssetDetails}
      />
      <ReturnAssetDialog
        open={isReturnOpen}
        onOpenChange={setIsReturnOpen}
        assetId={assetId}
        onSuccess={fetchAssetDetails}
      />
      <DisposeAssetDialog
        open={isDisposeOpen}
        onOpenChange={setIsDisposeOpen}
        assetId={assetId}
        dropdowns={dropdowns}
        onSuccess={fetchAssetDetails}
      />
    </div>
  )
}
