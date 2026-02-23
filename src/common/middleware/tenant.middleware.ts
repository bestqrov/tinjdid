import { Request, Response, NextFunction } from 'express'

export function tenantMiddleware(req: Request & any, res: Response, next: NextFunction) {
  // prefer explicit companyId query param (super admin can pass this)
  const q = req.query?.companyId
  if (q) {
    req.companyId = q
    return next()
  }

  // if authenticated user present, use their companyId
  if (req.user && req.user.companyId) {
    req.companyId = req.user.companyId
  }
  return next()
}
