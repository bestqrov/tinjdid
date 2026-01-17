import { Controller, Get, Res, Req } from '@nestjs/common'
import { Response, Request } from 'express'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

@Controller()
export class AppController {
  // Root route handler
  @Get()
  getRoot(@Res() res: Response) {
    return this.serveApp(res)
  }

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
        companies: '/api/companies',
        vehicles: '/api/vehicles',
        drivers: '/api/drivers',
        trips: '/api/trips',
        quotes: '/api/quotes',
        invoices: '/api/invoices',
        charges: '/api/charges',
        dashboard: '/api/dashboard',
        finance: '/api/finance',
        contracts: '/api/contracts',
        consommation: '/api/consommation',
        settings: '/api/settings',
        cartes: '/api/cartes',
        superAdmin: '/api/super-admin',
      },
      documentation: 'See API_DOCUMENTATION.md for complete API reference',
    }
  }

  // Catch-all route for SPA routing (must be last)
  @Get('*')
  serveApp(@Res() res: Response) {
    // Try multiple possible Next.js build output locations
    const possiblePaths = [
      join(process.cwd(), 'frontend', '.next', 'server', 'pages', 'index.html'),
      join(process.cwd(), 'frontend', '.next', 'server', 'app', 'index.html'),
      join(process.cwd(), 'frontend', 'dist', 'index.html'),
      join(process.cwd(), 'frontend', 'out', 'index.html'),
    ]

    // Try to find and serve the index.html
    for (const indexPath of possiblePaths) {
      if (existsSync(indexPath)) {
        try {
          const html = readFileSync(indexPath, 'utf-8')
          res.setHeader('Content-Type', 'text/html')
          return res.send(html)
        } catch (error) {
          console.error(`Error reading ${indexPath}:`, error)
        }
      }
    }

    // If no frontend build found, return helpful API information
    res.status(200).json({
      message: 'ArwaPark API Server',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      api: {
        baseUrl: '/api',
        health: '/health',
        documentation: 'See API_DOCUMENTATION.md',
      },
      note: 'Frontend application not found. This is a backend API server.',
      availableEndpoints: [
        'GET /health - Health check',
        'GET /api - API information',
        'POST /api/auth/login - User login',
        'GET /api/dashboard/totals - Dashboard statistics',
        '... see API_DOCUMENTATION.md for complete list',
      ],
    })
  }
}
