export const appConfig = () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  webUrl: process.env.WEB_URL ?? 'http://localhost:3000',
  mobileUrl: process.env.MOBILE_URL ?? 'http://localhost:3002',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://user:pass@localhost:5432/bizmanager',
  pdfEngineUrl: process.env.PDF_ENGINE_URL ?? 'http://localhost:8080',
})
