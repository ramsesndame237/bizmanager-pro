import type { Role } from './enums'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  employeeId?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  expiresIn: number
}
