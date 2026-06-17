// types/search.ts

export interface SearchEmployee {
  employee_id: string
  employee_name: string
  department: string
  role: string
}

export interface SearchAsset {
  asset_id: string
  asset_name: string
  asset_type: string
  serial_number: string
}

export interface SearchTicket {
  ticket_id: string
  title: string
  priority: string
  status: string
}

export interface SearchRequest {
  id: string
  title: string
  status: string
  request_type: string
}

export interface SearchAttendance {
  id: string
  employee_id: string
  employee_name: string
  status: string
}

export interface GlobalSearchData {
  employees?: SearchEmployee[]
  assets?: SearchAsset[]
  tickets?: SearchTicket[]
  requests?: SearchRequest[]
  attendance?: SearchAttendance[]
}

export interface UseCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface UseCommandPaletteReturn {
  search: string
  setSearch: (val: string) => void
  handleSelect: (href: string) => void
  results: GlobalSearchData | null
  isLoading: boolean
}

