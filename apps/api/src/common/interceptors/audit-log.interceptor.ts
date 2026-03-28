import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import type { Request } from 'express'
import type { JwtPayload } from '../../auth/strategies/jwt.strategy'

interface AuditEntry {
  userId: string
  userRole: string
  method: string
  path: string
  statusCode: number
  durationMs: number
  timestamp: string
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp()
    const req = http.getRequest<Request & { user?: JwtPayload }>()

    const { method, path } = req
    const user = req.user

    if (!user || ['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next.handle()
    }

    const start = Date.now()

    return next.handle().pipe(
      tap({
        next: () => {
          const res = http.getResponse<{ statusCode: number }>()
          const entry: AuditEntry = {
            userId: user.sub,
            userRole: user.role,
            method,
            path,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
            timestamp: new Date().toISOString(),
          }
          this.logger.log(JSON.stringify(entry))
        },
        error: (err: { status?: number }) => {
          const entry: AuditEntry = {
            userId: user.sub,
            userRole: user.role,
            method,
            path,
            statusCode: err.status ?? 500,
            durationMs: Date.now() - start,
            timestamp: new Date().toISOString(),
          }
          this.logger.error(JSON.stringify(entry))
        },
      }),
    )
  }
}
