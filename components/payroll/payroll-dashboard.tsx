// components/payroll/payroll-dashboard.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { PayrollTrendsChart } from './payroll-trends-chart'
import { PayrollTableRow } from './payroll-table-row'
import { INITIAL_PAYROLL_DATA } from './payroll-constants'

export function PayrollDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('January 2024')

  const totalPayroll = INITIAL_PAYROLL_DATA.reduce((sum, p) => sum + p.baseSalary + p.allowances + p.overtime, 0)
  const totalDeductions = INITIAL_PAYROLL_DATA.reduce((sum, p) => sum + p.deductions, 0)
  const totalNetPayout = INITIAL_PAYROLL_DATA.reduce((sum, p) => sum + p.netSalary, 0)

  const filteredPayroll = INITIAL_PAYROLL_DATA.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-violet-core/20">
              <DollarSign className="w-5 h-5 text-violet-glow" />
            </div>
            <TrendingUp className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-xs text-muted-foreground mb-1">Total Payroll</p>
          <p className="text-2xl font-semibold text-cloud font-mono">
            AED {totalPayroll.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-red-400/20">
              <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
          <p className="text-2xl font-semibold text-cloud font-mono">
            AED {totalDeductions.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-lime-400/20">
              <DollarSign className="w-5 h-5 text-lime-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Net Payout</p>
          <p className="text-2xl font-semibold text-lime-400 font-mono">
            AED {totalNetPayout.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-[20px] [corner-shape:squircle] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[16px] [corner-shape:squircle] bg-teal-400/20">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Employees</p>
          <p className="text-2xl font-semibold text-cloud font-mono">
            {INITIAL_PAYROLL_DATA.length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <PayrollTrendsChart />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <Button variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="px-4 py-2 bg-midnight rounded-[16px] [corner-shape:squircle] min-w-32 text-center">
            <span className="text-sm font-medium text-cloud">{selectedMonth}</span>
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-midnight border-border"
            />
          </div>
          <Button variant="outline" className="gap-2 justify-center">
            <Download className="w-4 h-4" />
            Export WPS
          </Button>
          <Button className="gap-2 bg-violet-core hover:bg-violet-deep justify-center">
            <FileText className="w-4 h-4" />
            Generate Payslips
          </Button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-carbon border border-border rounded-[32px] [corner-shape:squircle] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Employee</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Base Salary</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Allowances</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Overtime</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Deductions</th>
                <th className="text-right px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">Net Salary</th>
                <th className="text-center px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">WPS Status</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPayroll.map((record, index) => (
                <PayrollTableRow key={record.id} record={record} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
