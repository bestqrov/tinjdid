import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { join } from 'path'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) { }

  async validateUser(email: string, pass: string) {
    let user = await this.prisma.user.findUnique({ where: { email } })

    // Self-Initialization: If admin tries to login and DB is empty, auto-seed
    if (!user && email === 'admin@demo.com') {
      const userCount = await this.prisma.user.count()
      if (userCount === 0) {
        console.log('🚀 First login detected. Auto-seeding database...')
        try {
          const pwd = await bcrypt.hash('password', 10)

          // Check/Create Company
          let company = await this.prisma.company.findFirst()
          if (!company) {
            company = await this.prisma.company.create({
              data: {
                name: 'Demo Tours',
                address: '123 Avenue des Voyageurs, Casablanca',
                contact: '+212600000000',
                timezone: 'Africa/Casablanca',
              }
            })
          }

          // Create Admin
          user = await this.prisma.user.create({
            data: {
              email: 'admin@demo.com',
              password: pwd,
              name: 'Admin',
              role: 'ADMIN',
              companyId: company.id
            }
          })
          console.log('✅ Auto-seeding complete. Admin created.')

          // Optional: Create extra vehicle/driver if needed, but minimal is fine for login
          await this.prisma.vehicle.create({
            data: {
              companyId: company.id,
              type: 'VAN',
              seats: 8,
              plate: 'AUTO-SEED',
              status: 'ACTIVE',
              costPerKm: 0.5
            }
          })

        } catch (err) {
          console.error('❌ Auto-seeding failed:', err)
        }
      }
    }

    if (!user) {
      console.log(`❌ Login failed: User ${email} not found`)
      return null
    }

    const valid = await bcrypt.compare(pass, user.password)
    if (!valid) {
      console.log(`❌ Login failed: Invalid password for ${email}`)
      return null
    }

    // strip password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user as any
    return rest
  }

  async createTokensForUser(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role, companyId: user.companyId }
    const access = this.jwtService.sign(payload, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })
    const refresh = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', secret: process.env.JWT_REFRESH_SECRET || 'refreshchangeme' })
    return { access, refresh }
  }
}
