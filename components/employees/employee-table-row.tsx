// components/employees/employee-table-row.tsx
'use client'

import { motion } from 'framer-motion'
import { Calendar, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getEmployeeStatusBadgeVariant } from '@/lib/ui/design-system'
import { departmentConfig } from './employee-constants'
import type { Employee } from './employee-table-types'

interface EmployeeTableRowProps {
  employee: Employee
  index: number
  onSelect: () => void
  onToggleStatus: (employee: Employee, active: boolean) => void
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
}

export function EmployeeTableRow({
  employee,
  index,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
}: EmployeeTableRowProps) {
  const initials = employee.full_name
    ? employee.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  const statusVariant = getEmployeeStatusBadgeVariant(employee.status)

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border/50 hover:bg-violet-core/5 transition-colors duration-150 cursor-pointer"
      onClick={onSelect}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-cloud">{employee.full_name}</p>
            <p className="text-xs font-mono text-violet-glow">{employee.employee_id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            departmentConfig[employee.department]?.className ||
              'bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-lg text-xs font-medium'
          )}
        >
          {employee.department}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-300 font-medium">{employee.designation}</span>
      </td>
      <td className="px-4 py-3">
        <CommonStatusBadge variant={statusVariant} label={employee.status} />
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={employee.status === 'Active'}
          onCheckedChange={(checked) => onToggleStatus(employee, checked)}
        />
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm text-slate-300 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400/80" />
          {employee.joined_date
            ? new Date(employee.joined_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-midnight">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border text-xs rounded-xl">
            <DropdownMenuItem onClick={onSelect} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit(employee)
              }}
              className="cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(employee.id)
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  )
}
