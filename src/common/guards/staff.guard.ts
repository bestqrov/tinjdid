import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    return user && (user.role === 'STAFF' || user.role === 'ADMIN' || user.role === 'COMPANY_ADMIN' || user.role === 'SUPERADMIN')
  }
}
