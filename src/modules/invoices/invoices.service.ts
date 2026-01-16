import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) { }

  create(companyId: string, data: any) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    if (d.tripId) {
      d.trip = { connect: { id: d.tripId } }
      delete d.tripId
    }
    // Convert date strings to DateTime
    if (d.date) {
      d.date = new Date(d.date)
    }
    if (d.dateDelivrance) {
      d.dateDelivrance = new Date(d.dateDelivrance)
    }
    delete d.companyId
    return this.prisma.invoice.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.invoice.findMany({ where: { companyId: companyId } })
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({ where: { id: id } })
  }

  update(id: string, data: any) {
    const d: any = { ...data }
    if (d.tripId) {
      d.trip = { connect: { id: d.tripId } }
      delete d.tripId
    }
    // Convert date strings to DateTime
    if (d.date) {
      d.date = new Date(d.date)
    }
    if (d.dateDelivrance) {
      d.dateDelivrance = new Date(d.dateDelivrance)
    }
    delete d.companyId
    return this.prisma.invoice.update({ where: { id: id }, data: d })
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id: id } })
  }
}
