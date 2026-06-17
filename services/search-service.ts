// services/search-service.ts
import { api } from '@/lib/api'
import type { GlobalSearchData } from '@/types/search'

interface GlobalSearchItem {
  module_type: string
  id: number
  title: string
  subtitle: string
  request_type?: string
}

interface SearchResponseShape {
  results?: {
    data?: {
      results?: GlobalSearchItem[]
    } & GlobalSearchData
  } & GlobalSearchData
  employees?: unknown
  assets?: unknown
  tickets?: unknown
  requests?: unknown
  attendance?: unknown
}

export const searchService = {
  async globalSearch(query: string, signal?: AbortSignal): Promise<GlobalSearchData> {
    try {
      const response = await api.get<SearchResponseShape>(
        '/api/global-search/',
        {
          params: { search: query },
          signal,
        }
      )

      // 1. Check if backend returned a flat list of results
      let flatResults: GlobalSearchItem[] | undefined
      if (response && response.results?.data && Array.isArray(response.results.data.results)) {
        flatResults = response.results.data.results
          } else if (response && response.results && Array.isArray((response.results as any).results)) {
        flatResults = (response.results as any).results
      } else if (response && Array.isArray(response.results)) {
        flatResults = response.results as unknown as GlobalSearchItem[]
      } else if (response && Array.isArray(response)) {
        flatResults = response as unknown as GlobalSearchItem[]
      }

      if (flatResults) {
        const employees: any[] = []
        const attendance: any[] = []
        const requests: any[] = []
        const assets: any[] = []
        const tickets: any[] = []

        flatResults.forEach((item) => {
          const type = (item.module_type ?? '').toLowerCase()
          if (type === 'employees' || type === 'employee') {
            employees.push({
              employee_id: item.subtitle || `EMP-${item.id}`,
              employee_name: item.title,
              department: '',
              role: '',
            })
          } else if (type === 'attendance') {
            attendance.push({
              id: `attendance-${item.id}`,
              employee_id: item.subtitle || `EMP-${item.id}`,
              employee_name: item.title ? item.title.replace(/^Attendance:\s*/i, '') : '',
              status: 'Present',
            })
          } else if (type === 'request' || type === 'requests') {
            const requestType = item.request_type || 'Leave'
            const typeKey = requestType.toLowerCase().replace(/\s+/g, '-')
            requests.push({
              id: `${typeKey}-${item.id}`,
              title: item.title || `${requestType} Request`,
              status: item.subtitle || 'Pending',
              request_type: requestType,
            })
          } else if (type === 'assets' || type === 'asset') {
            const isAssetId = item.subtitle && item.subtitle.match(/^[A-Z0-9_-]+$/i) && item.subtitle.toUpperCase().startsWith('AST')
            assets.push({
              asset_id: isAssetId ? item.subtitle : `AST-${item.id}`,
              asset_name: item.title,
              asset_type: '',
              serial_number: '',
            })
          } else if (type === 'tickets' || type === 'ticket') {
            const isTicketId = item.subtitle && item.subtitle.match(/^[A-Z0-9_-]+$/i) && item.subtitle.toUpperCase().startsWith('TCK')
            tickets.push({
              ticket_id: isTicketId ? item.subtitle : `TCK-${item.id}`,
              title: item.title,
              priority: '',
              status: '',
            })
          }
        })

        return { employees, attendance, requests, assets, tickets }
      }

      // Grouped structure parsing fallback
      const data = response.results?.data ?? response.results ?? response
      return {
        employees: Array.isArray(data.employees) ? data.employees : [],
        assets: Array.isArray(data.assets) ? data.assets : [],
        tickets: Array.isArray(data.tickets) ? data.tickets : [],
        requests: Array.isArray(data.requests) ? data.requests : [],
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error
      console.warn('🔴 Network error during global search. Loading mock fallback.', error)
      return this.getMockResults(query)
    }
  },

  getMockResults(query: string): GlobalSearchData {
    const q = query.toLowerCase()

    const employees = [
      { employee_id: 'EMP001', employee_name: 'John Doe', department: 'Engineering', role: 'Developer' },
      { employee_id: 'EMP002', employee_name: 'Sarah Johnson', department: 'HR', role: 'Manager' },
      { employee_id: 'EMP003', employee_name: 'Mohammed Hassan', department: 'Finance', role: 'Analyst' },
      { employee_id: 'EMP004', employee_name: 'Fatima Al Rashid', department: 'Marketing', role: 'Lead' },
      { employee_id: 'EMP005', employee_name: 'James Wilson', department: 'Operations', role: 'Director' },
    ].filter((e) =>
      e.employee_name.toLowerCase().includes(q) ||
      e.employee_id.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    )

    const assets = [
      { asset_id: 'AST001', asset_name: 'MacBook Pro 16', asset_type: 'Laptop', serial_number: 'C02F1234Q05D' },
      { asset_id: 'AST002', asset_name: 'Dell UltraSharp 27', asset_type: 'Monitor', serial_number: 'CN08345678' },
      { asset_id: 'AST003', asset_name: 'iPhone 15 Pro', asset_type: 'Mobile', serial_number: 'DN09876543' },
    ].filter((a) =>
      a.asset_name.toLowerCase().includes(q) ||
      a.asset_id.toLowerCase().includes(q) ||
      a.asset_type.toLowerCase().includes(q)
    )

    const tickets = [
      { ticket_id: 'TCK001', title: 'VPN connection failure', priority: 'High', status: 'Open' },
      { ticket_id: 'TCK002', title: 'Keyboard replacement request', priority: 'Low', status: 'In Progress' },
      { ticket_id: 'TCK003', title: 'Salary slip clarification', priority: 'Medium', status: 'Resolved' },
    ].filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.ticket_id.toLowerCase().includes(q)
    )

    const requests = [
      { id: 'leave-1', title: 'Leave Request', status: 'Approved', request_type: 'Leave' },
      { id: 'salary-advance-2', title: 'Salary Advance Request', status: 'Pending', request_type: 'Salary Advance' },
    ].filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.request_type.toLowerCase().includes(q)
    )

    const attendance = [
      { id: 'attendance-mock-1', employee_id: 'EMP001', employee_name: 'John Doe', status: 'Present' },
      { id: 'attendance-mock-2', employee_id: 'EMP002', employee_name: 'Sarah Johnson', status: 'Absent' },
    ].filter((a) =>
      a.employee_name.toLowerCase().includes(q) ||
      a.employee_id.toLowerCase().includes(q)
    )

    return { employees, assets, tickets, requests, attendance }
  }
}
