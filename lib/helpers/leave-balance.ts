// lib/helpers/leave-balance.ts
import type { LeaveBalanceRecord } from '@/types/request'

export function normalizeLeaveTypeKey(name: string): string {
  return name.trim().toLowerCase()
}

export function buildLeaveBalanceMap(balances: LeaveBalanceRecord[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const record of balances) {
    map.set(normalizeLeaveTypeKey(record.leave_type), record.balance)
  }
  return map
}

export function findBalanceForLeaveType(
  leaveTypeName: string,
  balances: LeaveBalanceRecord[]
): number | null {
  const key = normalizeLeaveTypeKey(leaveTypeName)
  const match = balances.find((record) => normalizeLeaveTypeKey(record.leave_type) === key)
  return match ? match.balance : null
}

export function formatLeaveBalance(balance: number): string {
  if (!Number.isFinite(balance)) return '0'
  return Number.isInteger(balance) ? String(balance) : balance.toFixed(1)
}

export function shouldEnforceLeaveBalance(
  leaveType: { is_paid_leave?: boolean } | null | undefined
): boolean {
  return leaveType?.is_paid_leave !== false
}
