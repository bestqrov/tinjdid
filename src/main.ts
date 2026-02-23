import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { existsSync } from 'fs'
import * as multer from 'multer'
import { CustomLogger } from './common/logger/custom.logger'

async function bootstrap() {
  try {
    // Initialize Next.js - use require to avoid ESM/CommonJS issues
    const next = require('next')

    // Explicitly check for production
    const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase()
    const dev = nodeEnv !== 'production'

    // Safety: If we are in production, force dev: false regardless of any other weirdness
    const finalDev = nodeEnv === 'production' ? false : dev;

    console.log(`🌍 Environment: ${nodeEnv}`)
    console.log(`🔧 Next.js Mode: ${finalDev ? 'DEVELOPMENT' : 'PRODUCTION'}`)
    console.log(`📦 Next.js Version: ${require('next/package.json').version}`)

    // Determine frontend path robustly for Docker/Prod
    const frontendDir = join(process.cwd(), 'frontend')
    console.log(`📂 Frontend Path: ${frontendDir}`)

    if (require('fs').existsSync(frontendDir)) {
      console.log('✅ Frontend directory verified')
    } else {
      console.error('❌ Frontend directory MISSING at: ' + frontendDir)
      console.log('Listing current directory:', process.cwd())
      try {
        console.log('Contents:', require('fs').readdirSync(process.cwd()))
      } catch (e) { }
    }

    const nextApp = next({
      dev: finalDev,
      dir: frontendDir
    })

    // Defer handler creation until after prepare
    const handle = nextApp.getRequestHandler()
    let isNextReady = false

    // Initialize NestJS App first to bind port immediately
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: process.env.NODE_ENV === 'production' ? new CustomLogger() : ['error', 'warn', 'log'],
      bufferLogs: true,
      abortOnError: false,
    })

    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    }))
    app.use(cookieParser())

    // Enable CORS
    const defaultOrigins = process.env.NODE_ENV === 'production'
      ? ['https://arwapark.digima.cloud', 'http://arwapark.digima.cloud']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']

    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : defaultOrigins

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })

    // Multer Config for uploads
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, join(process.cwd(), 'uploads'))
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
      }
    })

    const upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true)
        } else {
          cb(new Error('Only image files are allowed') as any, false)
        }
      }
    })

    // Serve Static Assets
    const nextStaticPath = join(frontendDir, '.next', 'static')
    const publicPath = join(frontendDir, 'public')

    if (existsSync(nextStaticPath)) app.useStaticAssets(nextStaticPath, { prefix: '/_next/static' })
    if (existsSync(publicPath)) app.useStaticAssets(publicPath, { prefix: '/' })

    // Middlewares
    const { tenantMiddleware } = await import('./common/middleware/tenant.middleware')
    app.use(tenantMiddleware)

    // 1. Direct Health Check
    app.use('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        nextReady: isNextReady,
        timestamp: new Date().toISOString()
      })
    })

    // Debug Endpoint
    const expressApp = app.getHttpAdapter().getInstance()
    expressApp.post('/api/ping', (req, res) => {
      res.status(200).json({ message: 'pong', method: req.method })
    })

    // Handle OPTIONS requests explicitly
    expressApp.options('*', (req, res) => {
      res.sendStatus(204)
    })

    // 2. Logging
    app.use((req, res, next) => {
      console.log(`➡️  ${req.method} ${req.path}`)
      next()
    })

    // 3. Next.js Handler (Guarded)
    app.use((req, res, next) => {
      const path = req.path

      // All API calls go to NestJS
      if (path.startsWith('/api')) {
        console.log(`🎯 [NestJS API] ${req.method} ${path}`)
        return next()
      }

      // If Next.js isn't ready yet, show a friendly loading page
      if (!isNextReady) {
        console.log(`⏳ [Next.js proxy] NOT READY - Waiting for: ${path}`)
        res.status(503).send(`
          <html>
            <head><meta http-equiv="refresh" content="2"></head>
            <body style="font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh;">
              <div style="text-align:center">
                <h2>Application is starting...</h2>
                <p>Initialisation de l'interface en cours, veuillez patienter.</p>
              </div>
            </body>
          </html>
        `)
        return
      }

      // Pass everything else to Next.js
      return handle(req, res)
    })

    const port = process.env.PORT || 3000;

    // START SERVER
    await app.listen(port, '0.0.0.0');

    console.log(`✅ Backend server listening on port ${port}`)
    console.log('🔄 Starting Next.js initialization in background...')

    // Initialize Next.js in Background
    nextApp.prepare().then(() => {
      isNextReady = true
      console.log('✅ Next.js application ready!')

      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://arwapark.digima.cloud'
        : `http://localhost:${port}`;
      console.log(`🚀 API available at: ${baseUrl}/api`)
      console.log(`🌐 Frontend available at: ${baseUrl}`)

    }).catch(err => {
      console.error('❌ Next.js failed to start:', err)
    })

  } catch (error) {
    console.error('❌ Failed to start the backend server:', error)
    process.exit(1)
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error)
  process.exit(1)
})
