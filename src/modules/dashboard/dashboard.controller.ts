import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'

@Controller('dashboard')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('totals')
  async totals(@Query('companyId') companyId: string, @Req() req) {
    const cid = companyId || req.user.companyId
    const revenue = await this.prisma.invoice.aggregate({ where: { companyId: cid }, _sum: { amount: true } })
    const charges = await this.prisma.charge.aggregate({ where: { companyId: cid }, _sum: { amount: true } })
    const trips = await this.prisma.trip.findMany({ where: { companyId: cid }, include: { charges: true, invoice: true } })

    const profit = (revenue._sum.amount || 0) - (charges._sum.amount || 0)
    const profitPerTrip = trips.map(t => {
      const totalCharges = (t.charges || []).reduce((s, c) => s + c.amount, 0)
      const invoiceAmount = t.invoice ? t.invoice.amount : t.price
      return { tripId: t.id, profit: invoiceAmount - totalCharges }
    })

    return {
      revenue: revenue._sum.amount || 0,
      charges: charges._sum.amount || 0,
      profit,
      profitPerTrip,
      tripsCount: trips.length,
    }
  }
}
