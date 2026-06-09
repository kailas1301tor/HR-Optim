// components/assets/asset-amc-tab.tsx
'use client'

import { type AssetDropdowns } from '@/services/asset-service'
import { Loader2, Shield, Plus, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useAssetAmcTab } from './useAssetAmcTab'

interface AssetAMCTabProps {
  assetId: number
  dropdowns: AssetDropdowns | null
}

export function AssetAMCTab({ assetId, dropdowns }: AssetAMCTabProps) {
  const {
    amcs,
    isLoading,
    isAddOpen,
    isSubmitting,
    providers,
    form,
    setIsAddOpen,
    onSubmit,
    getStatusBadge,
    formatDate,
  } = useAssetAmcTab(assetId, dropdowns)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header action bar */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-glow" /> AMC Contracts List
        </h3>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add AMC Contract
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/80 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-2">
                  <Skeleton className={cn('h-4.5 w-32 rounded-xl', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-3.5 w-24 rounded-xl', uiSkeletonBlock)} />
                </div>
                <Skeleton className={cn('h-5 w-16 rounded-full', uiSkeletonBlock)} />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-midnight/35 border border-border/40 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Skeleton className={cn('w-4 h-4 rounded-full shrink-0', uiSkeletonBlock)} />
                  <div className="space-y-1 w-full">
                    <Skeleton className={cn('h-2 w-10 rounded-xl', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-24 rounded-xl', uiSkeletonBlock)} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className={cn('w-4 h-4 rounded-full shrink-0', uiSkeletonBlock)} />
                  <div className="space-y-1 w-full">
                    <Skeleton className={cn('h-2 w-12 rounded-xl', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-20 rounded-xl', uiSkeletonBlock)} />
                  </div>
                </div>
              </div>
              <Skeleton className={cn('h-10 w-full rounded-xl', uiSkeletonBlock)} />
            </div>
          ))}
        </div>
      ) : amcs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border bg-card text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-border/40 flex items-center justify-center text-slate-500 mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-cloud">No AMC contract records</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px]">Add warranties and service agreements to track maintenance schedules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amcs.map((amc) => (
            <div key={amc.id} className="bg-card border border-border/80 rounded-2xl p-5 space-y-4 hover:border-border transition-colors">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h4 className="text-sm font-bold text-cloud font-mono">{amc.contract_number}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{amc.service_provider}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase', getStatusBadge(amc.status))}>
                  {amc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-midnight/35 border border-border/40 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Duration</span>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {formatDate(amc.start_date)} — {formatDate(amc.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Contract Cost</span>
                    <p className="text-[11px] font-bold text-cloud font-mono">
                      AED {parseFloat(amc.amc_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {amc.coverage_details && (
                <div className="text-xs text-slate-400 bg-midnight/35 p-3 rounded-lg border border-border/30">
                  <span className="font-bold text-slate-500 block mb-1">Coverage Details</span>
                  {amc.coverage_details}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add AMC Dialog Form */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-card text-foreground border border-border/80 rounded-2xl max-w-md p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
              Add AMC Contract
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Service Provider select */}
            <div className="space-y-1.5">
              <Label htmlFor="service_provider" className="text-xs text-slate-400">Service Provider</Label>
              <Select
                onValueChange={(val) => setValue('service_provider', Number(val), { shouldValidate: true })}
              >
                <SelectTrigger className="w-full bg-midnight border-border">
                  <SelectValue placeholder="Select provider..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service_provider && (
                <p className="text-[11px] text-destructive font-medium">{errors.service_provider.message}</p>
              )}
            </div>

            {/* Contract Number */}
            <div className="space-y-1.5">
              <Label htmlFor="contract_number" className="text-xs text-slate-400">Contract Number</Label>
              <Input
                id="contract_number"
                placeholder="AMC-XXXXX"
                className="bg-midnight border-border"
                {...register('contract_number')}
              />
              {errors.contract_number && (
                <p className="text-[11px] text-destructive font-medium">{errors.contract_number.message}</p>
              )}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date" className="text-xs text-slate-400">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  className="bg-midnight border-border"
                  {...register('start_date')}
                />
                {errors.start_date && (
                  <p className="text-[11px] text-destructive font-medium">{errors.start_date.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end_date" className="text-xs text-slate-400">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  className="bg-midnight border-border"
                  {...register('end_date')}
                />
                {errors.end_date && (
                  <p className="text-[11px] text-destructive font-medium">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            {/* AMC Cost */}
            <div className="space-y-1.5">
              <Label htmlFor="amc_cost" className="text-xs text-slate-400">Contract Cost (AED)</Label>
              <Input
                id="amc_cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-midnight border-border"
                {...register('amc_cost')}
              />
              {errors.amc_cost && (
                <p className="text-[11px] text-destructive font-medium">{errors.amc_cost.message}</p>
              )}
            </div>

            {/* Coverage Details */}
            <div className="space-y-1.5">
              <Label htmlFor="coverage_details" className="text-xs text-slate-400">Coverage Details</Label>
              <Textarea
                id="coverage_details"
                placeholder="Specify parts, timelines or support channels covered..."
                className="bg-midnight border-border min-h-[80px]"
                {...register('coverage_details')}
              />
              {errors.coverage_details && (
                <p className="text-[11px] text-destructive font-medium">{errors.coverage_details.message}</p>
              )}
            </div>

            <DialogFooter className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isSubmitting}
                className="rounded-xl h-10 w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl h-10 w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Adding...
                  </>
                ) : (
                  'Add Contract'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
