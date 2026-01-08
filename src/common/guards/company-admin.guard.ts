import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    return user && (user.role === 'COMPANY_ADMIN' || user.role === 'ADMIN' || user.role === 'SUPERADMIN')
  }
}
