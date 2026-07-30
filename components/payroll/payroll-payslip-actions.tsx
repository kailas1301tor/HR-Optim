// components/payroll/payroll-payslip-actions.tsx
'use client'

import { useState } from 'react'
import { Download, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import {
  buildPayslipFilename,
  downloadPayrollPayslip,
  PAYSLIP_UNAVAILABLE_MESSAGE,
  viewPayrollPayslip,
} from '@/lib/helpers/payroll-payslip'
import type { PayrollRecord } from '@/types/payroll'

interface PayrollPayslipActionsProps {
  payslipUrl: string | null
  record: Pick<PayrollRecord, 'employeeId' | 'startDate' | 'endDate'>
  size?: 'sm' | 'default'
  layout?: 'inline' | 'card'
  className?: string
}

export function PayrollPayslipActions({
  payslipUrl,
  record,
  size = 'default',
  layout = 'inline',
  className,
}: PayrollPayslipActionsProps): React.JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false)
  const hasPayslip = Boolean(payslipUrl)
  const isSmall = size === 'sm'
  const isCardLayout = layout === 'card'

  const buttonClassName = cn(
    uiOutlineBtn,
    isSmall ? 'h-8 text-[10px] gap-1 px-2' : 'h-9 text-xs gap-1.5 px-3',
    isCardLayout && 'w-full justify-center h-10 min-h-10 text-xs gap-1.5 px-3'
  )

  const handleView = (): void => {
    if (!payslipUrl) {
      toast.error(PAYSLIP_UNAVAILABLE_MESSAGE)
      return
    }
    viewPayrollPayslip(payslipUrl)
  }

  const handleDownload = async (): Promise<void> => {
    if (!payslipUrl) {
      toast.error(PAYSLIP_UNAVAILABLE_MESSAGE)
      return
    }
    setIsDownloading(true)
    try {
      await downloadPayrollPayslip(payslipUrl, buildPayslipFilename(record))
    } catch {
      toast.error('Failed to download payslip')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className={cn(
        isCardLayout ? 'grid grid-cols-2 gap-2 w-full' : 'flex items-center justify-end gap-1.5',
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={handleView}
        disabled={!hasPayslip}
        title={hasPayslip ? 'View payslip' : PAYSLIP_UNAVAILABLE_MESSAGE}
        aria-label={hasPayslip ? 'View payslip' : PAYSLIP_UNAVAILABLE_MESSAGE}
        className={buttonClassName}
      >
        <Eye className={cn(isSmall && !isCardLayout ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        View
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleDownload()}
        disabled={!hasPayslip || isDownloading}
        title={hasPayslip ? 'Download payslip' : PAYSLIP_UNAVAILABLE_MESSAGE}
        aria-label={hasPayslip ? 'Download payslip' : PAYSLIP_UNAVAILABLE_MESSAGE}
        className={buttonClassName}
      >
        {isDownloading ? (
          <Loader2 className={cn(isSmall && !isCardLayout ? 'w-3.5 h-3.5' : 'w-4 h-4', 'animate-spin')} />
        ) : (
          <Download className={cn(isSmall && !isCardLayout ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        )}
        Download
      </Button>
    </div>
  )
}
