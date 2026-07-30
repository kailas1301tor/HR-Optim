// lib/helpers/payroll-payslip.ts
import { downloadBlob } from '@/lib/helpers/download-blob'
import type { PayrollRecord } from '@/types/payroll'

export const PAYSLIP_UNAVAILABLE_MESSAGE = 'Payslip not available yet'

export function buildPayslipFilename(record: Pick<PayrollRecord, 'employeeId' | 'startDate' | 'endDate'>): string {
  const employeePart = record.employeeId.replace(/[^a-zA-Z0-9_-]/g, '_') || 'employee'
  const startPart = record.startDate || 'start'
  const endPart = record.endDate || 'end'
  return `payslip_${employeePart}_${startPart}_${endPart}.pdf`
}

export function viewPayrollPayslip(url: string): void {
  if (!url) return
  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (opened) opened.opener = null
}

export async function downloadPayrollPayslip(url: string, filename?: string): Promise<void> {
  if (!url) return

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to download payslip')
    }
    const blob = await response.blob()
    downloadBlob(blob, filename ?? buildPayslipFilenameFromUrl(url))
  } catch {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename ?? ''
    anchor.rel = 'noopener noreferrer'
    anchor.target = '_blank'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}

function buildPayslipFilenameFromUrl(url: string): string {
  const cleanUrl = url.split('?')[0]
  const segment = cleanUrl.split('/').pop()
  return segment && segment.length > 0 ? segment : 'payslip.pdf'
}
