import { Body, Controller, Post, UnauthorizedException, Req, Res, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaService } from '../../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import * as jwt from 'jsonwebtoken'

function cookieOptions() {
  const secure = process.env.NODE_ENV === 'production'
  return { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res) {
    try {
      const user = await this.authService.validateUser(body.email, body.password)
      if (!user) throw new UnauthorizedException()

      const tokens = await this.authService.createTokensForUser(user)

      // persist refresh token in DB
      const expiresAt = new Date(Date.now() + (parseInt(process.env.JWT_REFRESH_EXPIRES_MS || String(7 * 24 * 60 * 60 * 1000)) ))
      await this.prisma.refreshToken.create({ data: { token: tokens.refresh, userId: user.id, expiresAt } })

      // set httpOnly cookie
      res.cookie('refresh_token', tokens.refresh, cookieOptions())
      // return access token only
      return res.json({ access: tokens.access })
    } catch (e) {
      // log the error for debugging
      // eslint-disable-next-line no-console
      console.error('AuthController.login error:', e)
      throw e
    }
  }

  @Post('refresh')
  async refresh(@Req() req, @Res() res) {
    const token = req.cookies?.refresh_token
    if (!token) throw new UnauthorizedException('Missing refresh token')

    try {
      const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshchangeme')
      const r = await this.prisma.refreshToken.findUnique({ where: { token } })
      if (!r) throw new UnauthorizedException('Invalid refresh token')
      if (new Date(r.expiresAt) < new Date()) {
        // remove expired
        await this.prisma.refreshToken.deleteMany({ where: { token } })
        throw new UnauthorizedException('Refresh token expired')
      }

      // rotate: delete old token and issue new
      await this.prisma.refreshToken.deleteMany({ where: { token } })
      const newTokens = await this.authService.createTokensForUser({ id: payload.sub, email: payload.email, role: payload.role, companyId: payload.companyId })
      const expiresAt = new Date(Date.now() + (parseInt(process.env.JWT_REFRESH_EXPIRES_MS || String(7 * 24 * 60 * 60 * 1000)) ))
      await this.prisma.refreshToken.create({ data: { token: newTokens.refresh, userId: payload.sub, expiresAt } })

      res.cookie('refresh_token', newTokens.refresh, cookieOptions())
      return res.json({ access: newTokens.access })
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    const token = req.cookies?.refresh_token
    if (token) {
      await this.prisma.refreshToken.deleteMany({ where: { token } })
    }
    res.clearCookie('refresh_token', { path: '/' })
    return res.json({ ok: true })
  }

  @Post('forgot-password')
  async forgot(@Body() body: { email: string; message?: string }) {
    // Create a password reset request for super admin
    await this.prisma.passwordResetRequest.create({
      data: {
        email: body.email,
        message: body.message || 'Demande de réinitialisation de mot de passe',
        status: 'PENDING'
      }
    })
    
    // Return success message
    return { 
      ok: true, 
      message: 'Votre demande a été envoyée au super administrateur. Vous recevrez un email avec les instructions de réinitialisation.'
    }
  }

  @Post('reset-password')
  async reset(@Body() body: { token: string; password: string }) {
    const r = await this.prisma.passwordReset.findUnique({ where: { token: body.token } })
    if (!r) throw new UnauthorizedException('Invalid or expired token')
    if (r.used) throw new UnauthorizedException('Token already used')
    if (new Date(r.expiresAt) < new Date()) throw new UnauthorizedException('Token expired')
    const bcrypt = require('bcrypt')
    const hash = await bcrypt.hash(body.password, 10)
    await this.prisma.user.update({ where: { id: r.userId }, data: { password: hash } })
    await this.prisma.passwordReset.update({ where: { id: r.id }, data: { used: true } })
    return { ok: true }
  }
}
