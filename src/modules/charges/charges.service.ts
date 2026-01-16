import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) { }

  create(companyId: string, data: any) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    if (d.tripId) {
      d.trip = { connect: { id: d.tripId } }
      delete d.tripId
    }
    delete d.companyId
    return this.prisma.charge.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.charge.findMany({ where: { companyId: companyId } })
  }

  findForTrip(tripId: string) {
    return this.prisma.charge.findMany({ where: { tripId: tripId } })
  }
}
