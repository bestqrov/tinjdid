import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) { }

  create(companyId: string, data: any) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    if (d.tripId) {
      d.trip = { connect: { id: d.tripId } }
      delete d.tripId
    }
    delete d.companyId
    return this.prisma.quote.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.quote.findMany({ where: { companyId: companyId } })
  }

  findOne(id: string) {
    return this.prisma.quote.findUnique({ where: { id: id } })
  }

  async convertToTrip(quoteId: string) {
    const q = await this.findOne(quoteId)
    if (!q || !q.tripId) {
      throw new Error('Quote has no trip to convert')
    }
    // simply return the trip - conversion usually handled when creating quote from trip
    return this.prisma.trip.findUnique({ where: { id: q.tripId } })
  }
}
