import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    if (!user) return false
    if (user.role === 'ADMIN') return true

    const companyIdFromQuery = req.query?.companyId
    // if companyId present in query, ensure it matches user's company
    if (companyIdFromQuery && companyIdFromQuery !== user.companyId) {
      throw new ForbiddenException('Access to this company is forbidden')
    }

    // if no companyId specified, allow — controllers should scope by req.user.companyId
    return true
  }
}
