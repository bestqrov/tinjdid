import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  // Root route handler - removed as handled by Next.js in main.ts
  // The global prefix 'api' means this controller handles /api/health, /api/seed etc.
  // Wait, did I setGlobalPrefix to 'api' without exclude? Yes.
  // But my middleware in main.ts handles /health explicitly.
  // So this @Get('health') might be shadowed by main.ts or served at /api/health.
  // That's fine.

  // Health check endpoint (accessible at /api/health via NestJS Router)
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
  }

  // API info endpoint (accessible at /api)
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
        seed: '/api/seed (Use once to initialize DB)'
      },
      documentation: 'See API_DOCUMENTATION.md for complete API reference',
    }
  }

  // Seeding endpoint to initialize production database
  @Get('seed')
  async seedDb() {
    try {
      // Check if admin exists
      const existingAdmin = await this.prisma.user.findUnique({ where: { email: 'admin@demo.com' } })
      if (existingAdmin) {
        return { message: 'Database already seeded', status: 'skipped' }
      }

      const pwd = await bcrypt.hash('password', 10)

      // Create company
      const company = await this.prisma.company.create({
        data: {
          name: 'Demo Tours',
          address: '123 Avenue des Voyageurs, Casablanca',
          contact: '+212600000000',
          timezone: 'Africa/Casablanca',
        }
      })

      // Create users
      await this.prisma.user.create({ data: { email: 'admin@demo.com', password: pwd, name: 'Admin', role: 'ADMIN', companyId: company.id } })
      await this.prisma.user.create({ data: { email: 'staff@demo.com', password: pwd, name: 'Staff', role: 'STAFF', companyId: company.id } })

      // Vehicles
      await this.prisma.vehicle.create({ data: { companyId: company.id, type: 'VAN', seats: 8, plate: '123-ABC', status: 'ACTIVE', costPerKm: 0.5 } })

      return {
        message: 'Seeding complete',
        status: 'success',
        credentials: {
          admin: 'admin@demo.com',
          staff: 'staff@demo.com',
          password: 'password'
        }
      }
    } catch (error) {
      return { message: 'Seeding failed', error: error.message }
    }
  }
}
