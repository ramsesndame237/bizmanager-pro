import type { EquipmentCategory, EquipmentStatus, FaultPriority, FaultStatus } from './enums'

export interface Equipment {
  id: string
  name: string
  serialNo?: string | null
  category: EquipmentCategory
  location?: string | null
  responsibleId?: string | null
  responsibleName?: string | null
  warrantyEnd?: string | null
  status: EquipmentStatus
  qrCode?: string | null
  purchaseDate?: string | null
  purchaseValue?: number | null
  supplier?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface EquipmentFault {
  id: string
  equipmentId: string
  equipmentName: string
  reportedBy: string
  reporterName: string
  priority: FaultPriority
  description: string
  photoUrl?: string | null
  status: FaultStatus
  assignedTo?: string | null
  assigneeName?: string | null
  externalProvider?: string | null
  laborCost?: number | null
  resolvedAt?: string | null
  resolution?: string | null
  createdAt: string
  updatedAt: string
}

export interface EquipmentStats {
  totalFaults: number
  resolvedFaults: number
  totalMaintenanceCost: number
  avgResolutionTimeHours: number
  mtbfDays: number | null
  lastFaultAt?: string | null
}

export interface CreateEquipmentDto {
  name: string
  serialNo?: string
  category: EquipmentCategory
  location?: string
  responsibleId?: string
  warrantyEnd?: string
  purchaseDate?: string
  purchaseValue?: number
  supplier?: string
  notes?: string
}

export interface DeclareFaultDto {
  equipmentId: string
  description: string
  priority: FaultPriority
  photoBase64?: string
}

export interface TransitionFaultStatusDto {
  status: FaultStatus
  note?: string
  laborCost?: number
  externalProvider?: string
  resolution?: string
}
