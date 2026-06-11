// components/employees/useEmployeeUiState.ts
'use client'

import { useState } from 'react'
import type { Employee } from '@/types/employee'

export interface UseEmployeeUiStateReturn {
  selectedEmployee: Employee | null
  drawerOpen: boolean
  isAddModalOpen: boolean
  editTarget: Employee | null
  deleteTargetId: number | null
  isDeleting: boolean
  setSelectedEmployee: (emp: Employee | null) => void
  setDrawerOpen: (open: boolean) => void
  setIsAddModalOpen: (open: boolean) => void
  setEditTarget: (target: Employee | null) => void
  setDeleteTargetId: (id: number | null) => void
  setIsDeleting: (deleting: boolean) => void
  handleEdit: (employee: Employee) => void
  handleDelete: (id: number) => void
  openAddModal: () => void
}

export function useEmployeeUiState(): UseEmployeeUiStateReturn {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Employee | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (employee: Employee) => {
    setEditTarget(employee)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteTargetId(id)
  }

  const openAddModal = () => {
    setEditTarget(null)
    setIsAddModalOpen(true)
  }

  return {
    selectedEmployee,
    drawerOpen,
    isAddModalOpen,
    editTarget,
    deleteTargetId,
    isDeleting,
    setSelectedEmployee,
    setDrawerOpen,
    setIsAddModalOpen,
    setEditTarget,
    setDeleteTargetId,
    setIsDeleting,
    handleEdit,
    handleDelete,
    openAddModal,
  }
}
