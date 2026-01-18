import { Controller, Get, Res, Req } from '@nestjs/common'
import { Response, Request } from 'express'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

@Controller()
export class AppController {
  // Root route handler - removed as handled by Next.js in main.ts

  // Health check endpoint (accessible at /health)
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
  }

  // API info endpoint (accessible at /api via global prefix)
  @Get('api')
  getApiInfo() {
    return {
      name: 'ArwaPark SaaS API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        dashboard: '/api/dashboard',
        // ... other endpoints
      },
      documentation: 'See API_DOCUMENTATION.md for complete API reference',
    }
  }
}
