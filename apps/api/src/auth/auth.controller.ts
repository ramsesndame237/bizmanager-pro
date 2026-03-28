import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { LoginResponseDto } from './dto/auth-response.dto'
import { Public } from '../common/decorators/public.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { JwtPayload } from './strategies/jwt.strategy'

const REFRESH_COOKIE = 'refresh_token'

const refreshCookieOptions = (secure: boolean) => ({
  httpOnly: true,
  secure,
  sameSite: 'strict' as const,
  path: '/api/v1/auth/refresh',
  maxAge: 30 * 24 * 60 * 60 * 1000,
})

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const ipAddress = (req.headers['x-forwarded-for'] as string) ?? req.ip
    const { accessToken, refreshToken, user } = await this.authService.login(dto, ipAddress)
    const isSecure = req.secure || process.env['NODE_ENV'] === 'production'

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions(isSecure))

    return { accessToken, user }
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and get new access token' })
  @ApiResponse({ status: 200, schema: { properties: { accessToken: { type: 'string' } } } })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined
    if (!token) throw new UnauthorizedException('No refresh token provided')

    const { accessToken, refreshToken } = await this.authService.refresh(token)
    const isSecure = req.secure || process.env['NODE_ENV'] === 'production'

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions(isSecure))

    return { accessToken }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke all refresh tokens' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(user.sub)
    const isSecure = req.secure || process.env['NODE_ENV'] === 'production'
    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth/refresh', secure: isSecure })
  }
}
