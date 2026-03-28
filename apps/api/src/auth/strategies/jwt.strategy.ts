import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Role } from '@bizmanager/shared-types'
import type { AppConfig } from '../../config/app.config'

export interface JwtPayload {
  sub: string
  email: string
  role: Role
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService<AppConfig>) {
    const secret = configService.get('JWT_SECRET', { infer: true })
    if (!secret) throw new Error('JWT_SECRET is not defined')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload')
    }
    return payload
  }
}
