import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'

@Controller('dashboard')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) { }

  @Get('totals')
  async totals(@Query('companyId') companyId: string, @Req() req) {
    const cid = companyId || req.user.companyId
    const revenue = await this.prisma.invoice.aggregate({ where: { companyId: cid }, _sum: { amount: true } })
    const charges = await this.prisma.charge.aggregate({ where: { companyId: cid }, _sum: { amount: true } })
    const trips = await this.prisma.trip.findMany({ where: { companyId: cid } })

    const profit = (revenue._sum.amount || 0) - (charges._sum.amount || 0)
    const profitPerTrip = await Promise.all(trips.map(async t => {
      const tripCharges = await this.prisma.charge.findMany({ where: { tripId: t.id } })
      const totalCharges = tripCharges.reduce((s, c) => s + c.amount, 0)
      const invoice = await this.prisma.invoice.findFirst({ where: { tripId: t.id } })
      const invoiceAmount = invoice ? invoice.amount : t.price
      return { tripId: t.id, profit: invoiceAmount - totalCharges }
    }))

    return {
      revenue: revenue._sum.amount || 0,
      charges: charges._sum.amount || 0,
      profit,
      profitPerTrip,
      tripsCount: trips.length,
    }
  }
}
