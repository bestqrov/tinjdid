import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { join } from 'path'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const valid = await bcrypt.compare(pass, user.password)
    if (!valid) return null
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
