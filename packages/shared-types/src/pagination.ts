export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}
