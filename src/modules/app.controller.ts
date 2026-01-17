import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

@Controller()
export class AppController {
  @Get('*')
  serveApp(@Res() res: Response) {
    // Serve Next.js index.html for all non-API routes (SPA routing)
    const indexPath = join(process.cwd(), 'frontend', '.next', 'server', 'pages', 'index.html')
    const fallbackIndexPath = join(process.cwd(), 'frontend', '.next', 'server', 'app', 'index.html')

    if (existsSync(indexPath)) {
      const html = readFileSync(indexPath, 'utf-8')
      res.setHeader('Content-Type', 'text/html')
      res.send(html)
    } else if (existsSync(fallbackIndexPath)) {
      const html = readFileSync(fallbackIndexPath, 'utf-8')
      res.setHeader('Content-Type', 'text/html')
      res.send(html)
    } else {
      // Fallback: return API info
      res.json({
        message: 'ArwaPark API is running',
        version: '1.0.0',
        api: '/api',
        health: '/health',
        error: 'Frontend build not found. Please run: cd frontend && npm run build'
      })
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

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
        administratif: '/api/administratif',
        consommation: '/api/consommation',
        settings: '/api/settings',
        cartes: '/api/cartes',
        superAdmin: '/api/super-admin',
      },
      documentation: 'API is running successfully',
    }
  }
}
