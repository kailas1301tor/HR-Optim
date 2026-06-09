// components/employees/employee-table-types.ts
export interface Employee {
  id: number
  user: {
    id?: number
    username: string
    email: string
  }
  bank_details: {
    bank_name: string
    account_number: string
    ifsc: string
    branch: string
  }
  full_name: string
  phone_number: string
  employee_id: string
  role: number
  role_name?: string
  department: string
  designation: string
  status: string
  shift: string
  employee_type: string
  nationality: string
  joined_date: string
  basic_salary: string
  accommodation: string
  date_of_birth: string
  address: string
}
