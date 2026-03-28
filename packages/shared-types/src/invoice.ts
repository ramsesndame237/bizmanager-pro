import type { InvoiceStatus, InvoiceType, PaymentMethod, QuoteStatus } from './enums'

export interface InvoiceLine {
  id: string
  productId: string
  productName: string
  qty: number
  unitPrice: number
  discount: number
  vatRate: number
  lineTotal: number
}

export interface Invoice {
  id: string
  number: string
  type: InvoiceType
  status: InvoiceStatus
  clientId: string
  clientName: string
  lines: InvoiceLine[]
  subtotal: number
  discountTotal: number
  vatTotal: number
  total: number
  paidAmount: number
  notes?: string | null
  pdfUrl?: string | null
  dueDate?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface Quote {
  id: string
  number: string
  status: QuoteStatus
  clientId: string
  clientName: string
  lines: InvoiceLine[]
  subtotal: number
  discountTotal: number
  vatTotal: number
  total: number
  validUntil?: string | null
  notes?: string | null
  pdfUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: PaymentMethod
  paidAt: string
}
