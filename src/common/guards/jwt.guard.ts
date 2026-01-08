import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const auth = req.headers['authorization'] || req.cookies?.access_token
    if (!auth) throw new UnauthorizedException('Missing token')
    const token = Array.isArray(auth) ? auth[0].split(' ')[1] : (auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth)
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'changeme')
      req.user = payload
      return true
    } catch (e) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
