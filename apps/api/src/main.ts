import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  })

  // Security headers
  app.use(helmet())

  // CORS
  app.enableCors({
    origin: [
      process.env.WEB_URL ?? 'http://localhost:3000',
      process.env.MOBILE_URL ?? 'http://localhost:3002',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BizManager Pro API')
    .setDescription('REST API for BizManager Pro — Business management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  logger.log(`API running on http://localhost:${port}/api/v1`)
  logger.log(`Swagger docs at http://localhost:${port}/api/docs`)
}

bootstrap()
