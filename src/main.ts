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
    const dev = process.env.NODE_ENV !== 'production'
    const nextApp = next({
      dev,
      dir: join(process.cwd(), 'frontend')
    })
    const handle = nextApp.getRequestHandler()

    console.log('🔄 Preparing Next.js application...')
    await nextApp.prepare()
    console.log('✅ Next.js application ready')

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: process.env.NODE_ENV === 'production' ? new CustomLogger() : ['error', 'warn', 'log'],
      bufferLogs: true,
      abortOnError: false,
    })

    app.setGlobalPrefix('api', {
      exclude: ['/', 'health', '*'],
    })
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    }))
    app.use(cookieParser())

    // Enable CORS with specific configuration
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

    // Configure multer for file uploads
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true)
        } else {
          cb(new Error('Only image files are allowed') as any, false)
        }
      }
    })

    app.use(upload.any())

    // Serve Next.js static assets
    const frontendDir = join(process.cwd(), 'frontend')
    const nextStaticPath = join(frontendDir, '.next', 'static')
    const publicPath = join(frontendDir, 'public')

    // Serve _next/static files
    if (existsSync(nextStaticPath)) {
      app.useStaticAssets(nextStaticPath, { prefix: '/_next/static' })
      console.log(`📦 Serving Next.js static files from: ${nextStaticPath}`)
    }

    // Serve public files
    if (existsSync(publicPath)) {
      app.useStaticAssets(publicPath, { prefix: '/' })
      console.log(`📦 Serving public files from: ${publicPath}`)
    }

    // tenant middleware: populate req.companyId from query or user
    const { tenantMiddleware } = await import('./common/middleware/tenant.middleware')
    app.use(tenantMiddleware)

    // Add Next.js handler for all non-API routes
    app.use((req, res, next) => {
      // Skip Next.js for API routes - let NestJS handle them
      if (req.path.startsWith('/api')) {
        return next()
      }

      // Pass all other routes to Next.js
      return handle(req, res)
    })

    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');

    // Determine base URL for logs
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://arwapark.digima.cloud'
      : `http://localhost:${port}`;

    console.log(`✅ Backend server started successfully!`)
    console.log(`🚀 API available at: ${baseUrl}/api`)
    console.log(`🌐 Frontend available at: ${baseUrl}`)
    console.log(`📁 Uploads directory: ${join(__dirname, '..', 'uploads')}`)
  } catch (error) {
    console.error('❌ Failed to start the backend server:', error)
    console.error('Error details:', error.message)
    if (error.stack) console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error)
  process.exit(1)
})
