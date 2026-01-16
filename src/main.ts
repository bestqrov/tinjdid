import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { existsSync } from 'fs'
import * as multer from 'multer'

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
    })

    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    }))
    app.use(cookieParser())

    // Enable CORS with specific configuration
    const defaultOrigins = process.env.NODE_ENV === 'production'
      ? ['https://arwapark.digima.cloud', 'http://arwapark.digima.cloud']
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005']

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

    // Serve Next.js frontend in production
    // Initialize Next.js (Custom Server)
    try {
      const frontendDir = join(process.cwd(), 'frontend');
      // Require next from the frontend's node_modules to avoid root dependency issues
      const next = require(join(frontendDir, 'node_modules', 'next'));
      const dev = process.env.NODE_ENV !== 'production';
      const nextApp = next({ dev, dir: frontendDir });
      const handle = nextApp.getRequestHandler();

      await nextApp.prepare();
      console.log('✅ Next.js app prepared');

      // Middleware to handle Next.js pages (everything except /api)
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
          next();
        } else {
          handle(req, res);
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize Next.js:', error);
      // Fallback: Try to serve public only if Next.js fails
      const frontendPublicPath = join(process.cwd(), 'frontend', 'public');
      if (existsSync(frontendPublicPath)) {
        app.useStaticAssets(frontendPublicPath, { prefix: '/' });
      }
    }

    // tenant middleware: populate req.companyId from query or user
    const { tenantMiddleware } = await import('./common/middleware/tenant.middleware')
    app.use(tenantMiddleware)

    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend server started successfully!`)
    console.log(`🚀 API available at: http://localhost:${port}/api`)
    console.log(`📁 Uploads directory: ${join(__dirname, '..', 'uploads')}`)
  } catch (error) {
    console.error('❌ Failed to start the backend server:', error)
    console.error('Error details:', error.message)
    process.exit(1)
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error)
  process.exit(1)
})
