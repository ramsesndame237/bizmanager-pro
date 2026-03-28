import type { ContractType, LeaveStatus, LeaveType, Role } from './enums'

export interface Employee {
  id: string
  name: string
  role: Role
  contractType: ContractType
  position?: string | null
  department?: string | null
  baseSalary: number
  hireDate: string
  phone?: string | null
  email?: string | null
  address?: string | null
  photoUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Leave {
  id: string
  employeeId: string
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  daysCount: number
  status: LeaveStatus
  reason?: string | null
  validatedBy?: string | null
  validatedAt?: string | null
  createdAt: string
}

export interface Attendance {
  id: string
  employeeId: string
  date: string
  checkIn?: string | null
  checkOut?: string | null
  workedHours?: number | null
}

export interface Payslip {
  id: string
  employeeId: string
  employeeName: string
  month: string
  baseSalary: number
  bonuses: number
  overtime: number
  gross: number
  socialSecurity: number
  incomeTax: number
  otherDeductions: number
  advances: number
  net: number
  pdfUrl?: string | null
  generatedAt: string
  approvedAt?: string | null
}

export interface LeaveBalance {
  employeeId: string
  paidLeave: number
  sickLeave: number
  other: number
}
