import type { RepairStatus } from './enums'

export interface DeviceInfo {
  brand: string
  model: string
  imei?: string
  serialNumber?: string
  accessories?: string[]
}

export interface Repair {
  id: string
  ticketNo: string
  clientId: string
  clientName: string
  clientPhone: string
  deviceInfo: DeviceInfo
  faultDesc: string
  status: RepairStatus
  techId?: string | null
  techName?: string | null
  estimatedCost?: number | null
  qrCode?: string | null
  ticketPdfUrl?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface RepairPart {
  id: string
  repairId: string
  productId: string
  productName: string
  productSku: string
  qty: number
  unitCost: number
  totalCost: number
}

export interface CreateRepairDto {
  clientId: string
  deviceInfo: DeviceInfo
  faultDesc: string
  estimatedCost?: number
}

export interface TransitionRepairStatusDto {
  status: RepairStatus
  note?: string
}
