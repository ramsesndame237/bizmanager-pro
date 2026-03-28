import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth.service'
import { PrismaService } from '../../prisma/prisma.service'
import { Role } from '@bizmanager/shared-types'

const mockUser = {
  id: 'user-1',
  email: 'admin@test.com',
  name: 'Admin User',
  passwordHash: '',
  role: Role.ADMIN,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-access-token'),
}

describe('AuthService', () => {
  let service: AuthService

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('Password123!', 10)
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return access token and user on valid credentials', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' })

      // Act
      const result = await service.login({ email: 'admin@test.com', password: 'Password123!' })

      // Assert
      expect(result.accessToken).toBe('mock-access-token')
      expect(result.user.email).toBe('admin@test.com')
      expect(result.user.role).toBe(Role.ADMIN)
      expect(result.refreshToken).toBeDefined()
      expect(mockPrisma.refreshToken.create).toHaveBeenCalledTimes(1)
    })

    it('should throw UnauthorizedException for unknown email', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(
        service.login({ email: 'unknown@test.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for wrong password', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      // Act & Assert
      await expect(
        service.login({ email: 'admin@test.com', password: 'WrongPassword!' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for inactive user', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false })

      // Act & Assert
      await expect(
        service.login({ email: 'admin@test.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('should revoke all refresh tokens for the user', async () => {
      // Arrange
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 })

      // Act
      await service.logout('user-1')

      // Assert
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      })
    })
  })
})
