export interface Client {
  id: string
  name: string
  phone: string
  email?: string | null
  address?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateClientDto {
  name: string
  phone: string
  email?: string
  address?: string
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}
