import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import type { LoginDto } from './dto/login.dto'
import type { AuthUserDto } from './dto/auth-response.dto'
import type { JwtPayload } from './strategies/jwt.strategy'

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: AuthUserDto
}

export interface RefreshResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string): Promise<LoginResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = await this.createRefreshToken(user.id)

    this.logger.log(`User ${user.email} logged in from ${ipAddress ?? 'unknown'}`)

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }
  }

  async refresh(rawToken: string): Promise<RefreshResult> {
    const hashed = this.hashToken(rawToken)

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: hashed },
      include: { user: true },
    })

    if (!stored || stored.expiresAt < new Date() || !stored.user.isActive) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    // Token rotation: delete old, issue new
    await this.prisma.refreshToken.delete({ where: { id: stored.id } })

    const payload: JwtPayload = {
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    }

    const accessToken = this.jwtService.sign(payload)
    const newRefreshToken = await this.createRefreshToken(stored.user.id)

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } })
    this.logger.log(`User ${userId} — all refresh tokens revoked`)
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const raw = crypto.randomBytes(64).toString('hex')
    const hashed = this.hashToken(raw)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await this.prisma.refreshToken.create({
      data: { token: hashed, userId, expiresAt },
    })

    return raw
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}
