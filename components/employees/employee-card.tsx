// components/employees/employee-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Calendar, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommonStatusBadge } from '@/components/common'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getEmployeeStatusBadgeVariant, uiCardInteractive } from '@/lib/ui/design-system'
import { departmentConfig } from './employee-constants'
import type { Employee } from './employee-table-types'

interface EmployeeCardProps {
  employee: Employee
  index: number
  onSelect: () => void
  onEdit: (employee: Employee) => void
  onDelete: (id: number) => void
}

export function EmployeeCard({ employee, index, onSelect, onEdit, onDelete }: EmployeeCardProps) {
  const initials = employee.full_name
    ? employee.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  const statusVariant = getEmployeeStatusBadgeVariant(employee.status)
  const deptClass =
    departmentConfig[employee.department]?.className ||
    'bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-[16px] [corner-shape:squircle] text-[10px] font-medium'

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(uiCardInteractive, 'p-5 group cursor-pointer')}
      aria-label={`View profile for ${employee.full_name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-10 h-10 shrink-0 ring-2 ring-border/40">
            <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cloud truncate group-hover:text-violet-glow transition-colors">
              {employee.full_name}
            </p>
            <p className="text-xs font-mono text-violet-glow">{employee.employee_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <CommonStatusBadge variant={statusVariant} label={employee.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-midnight"
                aria-label="Employee actions"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border text-xs rounded-[20px] [corner-shape:squircle]">
              <DropdownMenuItem onClick={onSelect} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(employee)} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2 text-slate-400" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-border/40" />
              <DropdownMenuItem
                onClick={() => onDelete(employee.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={deptClass}>{employee.department}</span>
        <span className="text-xs text-slate-300">{employee.designation}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border/40">
        <Calendar className="w-3.5 h-3.5 shrink-0" />
        <span className="font-mono">
          {employee.joined_date
            ? new Date(employee.joined_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A'}
        </span>
      </div>
    </motion.div>
  )
}
