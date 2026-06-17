// components/employees/profile/personal/employment-section.tsx
'use client'

import { Building2, Briefcase, Moon, Sun, FileCheck, Coins, Home, CalendarDays, Fingerprint } from 'lucide-react'
import type { Employee } from '@/types/employee'

interface EmploymentSectionProps {
  employee: Employee
}

export function EmploymentSection({ employee }: EmploymentSectionProps) {
  const formatSalary = (sal?: string) => {
    if (!sal || isNaN(parseFloat(sal))) return '—'
    const amount = parseFloat(sal).toLocaleString('en-US')
    return `$${amount}`
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-sans">Employment Profile</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Department</p>
            <p className="text-sm font-semibold text-cloud">{employee.department || '—'}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Position</p>
            <p className="text-sm font-semibold text-cloud">{employee.designation || '—'}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            {employee.shift?.toUpperCase() === 'NIGHT' ? (
              <Moon className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            )}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Work Shift</p>
            <p className="text-sm font-semibold text-cloud">{employee.shift || '—'}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <FileCheck className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Employment Type</p>
            <p className="text-sm font-semibold text-cloud">{employee.employee_type || '—'}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Coins className="w-4.5 h-4.5 text-teal-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Basic Salary</p>
            <p className="text-sm font-bold text-cloud font-mono">{formatSalary(employee.basic_salary)}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Home className="w-4.5 h-4.5 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Accommodation</p>
            <p className="text-sm font-semibold text-cloud">{employee.accommodation || '—'}</p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-violet-core/10 border border-violet-core/20 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4.5 h-4.5 text-violet-glow" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Join Date</p>
            <p className="text-sm font-semibold text-cloud font-mono">
              {employee.joined_date ? new Date(employee.joined_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }) : '—'}
            </p>
          </div>
        </div>
        <div className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-[20px] [corner-shape:squircle] bg-slate-500/10 border border-slate-500/20 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Employee ID</p>
            <p className="text-sm font-semibold text-slate-300 font-mono">{employee.employee_id || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
