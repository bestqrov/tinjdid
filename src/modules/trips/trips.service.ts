import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Trip } from '@prisma/client'

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  create(companyId: string, data: Prisma.TripCreateInput) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    delete d.companyId
    return this.prisma.trip.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.trip.findMany({ where: { companyId }, include: { charges: true, invoice: true } })
  }

  findOne(id: string) {
    return this.prisma.trip.findUnique({ where: { id }, include: { charges: true, invoice: true } })
  }

  async profitForTrip(id: string) {
    const trip = await this.findOne(id)
    if (!trip) return null
    const charges = trip.charges || []
    const totalCharges = charges.reduce((s, c) => s + c.amount, 0)
    const invoiceAmount = trip.invoice ? trip.invoice.amount : trip.price
    const profit = invoiceAmount - totalCharges
    return { tripId: id, invoiceAmount, totalCharges, profit }
  }
}
