export enum Role {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  TECHNICIAN = 'TECHNICIAN',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE',
}

export enum ProductCategory {
  TELECOM = 'TELECOM',
  IT = 'IT',
  APPLIANCE = 'APPLIANCE',
  ACCESSORY = 'ACCESSORY',
  OTHER = 'OTHER',
}

export enum StockMovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  ADJUSTMENT = 'ADJUSTMENT',
  REPAIR_USE = 'REPAIR_USE',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceType {
  INVOICE = 'INVOICE',
  QUOTE = 'QUOTE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum RepairStatus {
  INTAKE = 'INTAKE',
  DIAGNOSING = 'DIAGNOSING',
  WAITING_PARTS = 'WAITING_PARTS',
  IN_REPAIR = 'IN_REPAIR',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  FAULTY = 'FAULTY',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

export enum EquipmentCategory {
  COMPUTER = 'COMPUTER',
  PRINTER = 'PRINTER',
  NETWORK = 'NETWORK',
  PHONE = 'PHONE',
  VEHICLE = 'VEHICLE',
  OTHER = 'OTHER',
}

export enum FaultPriority {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
}

export enum FaultStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  INTERN = 'INTERN',
  FREELANCE = 'FREELANCE',
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
  UNPAID = 'UNPAID',
  OTHER = 'OTHER',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
