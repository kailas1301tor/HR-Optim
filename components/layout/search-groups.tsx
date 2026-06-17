// components/layout/search-groups.tsx
'use client'

import { Command } from 'cmdk'
import { User, Package, LifeBuoy, ArrowRight, Calendar, FileText } from 'lucide-react'
import { HELP_SUPPORT_LABEL } from '@/lib/support'
import { cn } from '@/lib/utils'
import { uiSquircleNav } from '@/lib/ui/design-system'
import type { SearchEmployee, SearchAsset, SearchTicket, SearchRequest, SearchAttendance } from '@/types/search'

interface EmployeesSearchGroupProps {
  employees: SearchEmployee[]
  onSelect: (href: string) => void
}

export function EmployeesSearchGroup({ employees, onSelect }: EmployeesSearchGroupProps) {
  return (
    <Command.Group heading="Employees" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Employees
      </div>
      {employees.map((employee) => (
        <Command.Item
          key={employee.employee_id}
          value={`${employee.employee_name} ${employee.employee_id} ${employee.department} ${employee.role}`}
          onSelect={() => onSelect(`/employees?employeeId=${employee.employee_id}`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{employee.employee_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-mono text-violet-glow">{employee.employee_id}</span>
              {' · '}
              {employee.department} {employee.role ? `· ${employee.role}` : ''}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface AssetsSearchGroupProps {
  assets: SearchAsset[]
  onSelect: (href: string) => void
}

export function AssetsSearchGroup({ assets, onSelect }: AssetsSearchGroupProps) {
  return (
    <Command.Group heading="Assets" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Assets
      </div>
      {assets.map((asset) => (
        <Command.Item
          key={asset.asset_id}
          value={`${asset.asset_name} ${asset.asset_id} ${asset.asset_type} ${asset.serial_number}`}
          onSelect={() => onSelect(`/assets`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className="w-8 h-8 rounded-full bg-midnight border border-border/40 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-violet-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{asset.asset_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-mono text-violet-glow">{asset.asset_id}</span>
              {' · '}
              {asset.asset_type} {asset.serial_number ? `· S/N: ${asset.serial_number}` : ''}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface TicketsSearchGroupProps {
  tickets: SearchTicket[]
  onSelect: (href: string) => void
}

export function TicketsSearchGroup({ tickets, onSelect }: TicketsSearchGroupProps) {
  return (
    <Command.Group heading={HELP_SUPPORT_LABEL} className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        {HELP_SUPPORT_LABEL}
      </div>
      {tickets.map((ticket) => (
        <Command.Item
          key={ticket.ticket_id}
          value={`${ticket.title} ${ticket.ticket_id} ${ticket.priority} ${ticket.status}`}
          onSelect={() => onSelect(`/tickets`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className="w-8 h-8 rounded-full bg-midnight border border-border/40 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-4 h-4 text-violet-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{ticket.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-mono text-violet-glow">{ticket.ticket_id}</span>
              {' · '}
              <span className={cn(
                ticket.priority === 'High' ? 'text-red-400 font-semibold' : 'text-slate-400'
              )}>{ticket.priority} Priority</span>
              {' · '}
              <span className="text-slate-500">{ticket.status}</span>
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface AttendanceSearchGroupProps {
  attendance: SearchAttendance[]
  onSelect: (href: string) => void
}

export function AttendanceSearchGroup({ attendance, onSelect }: AttendanceSearchGroupProps) {
  return (
    <Command.Group heading="Attendance" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Attendance
      </div>
      {attendance.map((record) => (
        <Command.Item
          key={record.id}
          value={`Attendance ${record.employee_name} ${record.employee_id} ${record.status}`}
          onSelect={() => onSelect(`/attendance?search=${record.employee_id}`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className="w-8 h-8 rounded-full bg-midnight border border-border/40 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-violet-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">Attendance: {record.employee_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-mono text-violet-glow">{record.employee_id}</span>
              {' · '}
              <span className="text-slate-500">{record.status}</span>
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}

interface RequestsSearchGroupProps {
  requests: SearchRequest[]
  onSelect: (href: string) => void
}

export function RequestsSearchGroup({ requests, onSelect }: RequestsSearchGroupProps) {
  return (
    <Command.Group heading="Requests" className="mb-2">
      <div className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
        Requests
      </div>
      {requests.map((request) => (
        <Command.Item
          key={request.id}
          value={`Request ${request.title} ${request.request_type} ${request.status}`}
          onSelect={() => onSelect(`/requests?requestId=${request.id}`)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 cursor-pointer text-slate-300 data-[selected=true]:bg-violet-core/20 data-[selected=true]:text-cloud',
            uiSquircleNav
          )}
        >
          <div className="w-8 h-8 rounded-full bg-midnight border border-border/40 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-violet-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{request.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="text-violet-glow font-medium">{request.request_type}</span>
              {' · '}
              <span className={cn(
                request.status === 'Approved' ? 'text-green-400' :
                request.status === 'Rejected' ? 'text-red-400' : 'text-amber-400'
              )}>{request.status}</span>
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Command.Item>
      ))}
    </Command.Group>
  )
}
