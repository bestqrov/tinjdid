import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Trip } from '@prisma/client'

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) { }

  create(companyId: string, data: Prisma.TripCreateInput) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    delete d.companyId
    return this.prisma.trip.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.trip.findMany({ where: { companyId: companyId } })
  }

  findOne(id: string) {
    return this.prisma.trip.findUnique({ where: { id: id } })
  }

  async profitForTrip(id: string) {
    const trip = await this.findOne(id)
    if (!trip) return null
    const charges = await this.prisma.charge.findMany({ where: { tripId: id } })
    const totalCharges = charges.reduce((s, c) => s + c.amount, 0)
    const invoice = await this.prisma.invoice.findFirst({ where: { tripId: id } })
    const invoiceAmount = invoice ? invoice.amount : trip.price
    const profit = invoiceAmount - totalCharges
    return { tripId: id, invoiceAmount, totalCharges, profit }
  }
}
