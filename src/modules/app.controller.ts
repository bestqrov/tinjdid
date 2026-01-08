import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'ArwaPark API is running',
      version: '1.0.0',
      api: '/api',
      health: '/health',
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
