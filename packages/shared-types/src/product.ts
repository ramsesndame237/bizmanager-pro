import type { ProductCategory, StockMovementType } from './enums'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  brand?: string | null
  barcode?: string | null
  buyPrice: number
  sellPrice: number
  vatRate: number
  qty: number
  minQty: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  product?: Pick<Product, 'id' | 'name' | 'sku'>
  type: StockMovementType
  qty: number
  reason?: string | null
  refType?: string | null
  refId?: string | null
  userId: string
  createdAt: string
}

export interface CreateProductDto {
  sku: string
  name: string
  category: ProductCategory
  brand?: string
  barcode?: string
  buyPrice: number
  sellPrice: number
  vatRate: number
  qty?: number
  minQty?: number
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateStockMovementDto {
  productId: string
  type: StockMovementType
  qty: number
  reason?: string
}
