// components/employees/profile/personal/bank-section.tsx
'use client'

import { Landmark } from 'lucide-react'
import { maskAccountNumber } from '@/lib/helpers/mask-sensitive'
import type { Employee } from '@/types/employee'

interface BankSectionProps {
  employee: Employee
}

export function BankSection({ employee }: BankSectionProps) {
  const bankName = employee.bank_details?.bank_name || '—'
  const accountNo = maskAccountNumber(employee.bank_details?.account_number)
  const ifsc = employee.bank_details?.ifsc || '—'
  const branch = employee.bank_details?.branch || '—'

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-sans">Bank & Payment Details</h3>
      <div className="bg-gradient-to-br from-[#1e293b]/70 to-[#0f172a]/70 border border-violet-core/20 rounded-[32px] [corner-shape:squircle] p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
          <Landmark className="w-24 h-24 text-cloud" />
        </div>
        
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-[20px] [corner-shape:squircle] bg-violet-core/15 border border-violet-core/30 flex items-center justify-center shrink-0 text-violet-glow">
            <Landmark className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-sm font-bold text-cloud">{bankName}</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Salary Disbursement Bank</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/35 pt-4">
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Account Number</p>
            <p className="text-sm font-mono font-semibold text-cloud mt-0.5">{accountNo}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">IFSC Code</p>
            <p className="text-sm font-mono font-semibold text-cloud mt-0.5">{ifsc}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Branch Name</p>
            <p className="text-sm font-mono font-semibold text-cloud mt-0.5">{branch}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
