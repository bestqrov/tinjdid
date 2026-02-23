import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) { }

  async generateQuotePdfBuffer(quoteId: string) {
    const quote = await this.prisma.quote.findUnique({ where: { id: quoteId } })
    if (!quote) throw new NotFoundException('Quote not found')

    const PDFDocument = require('pdfkit')
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => null)

    // Header
    doc.fontSize(20).text('Company', { align: 'left' })
    doc.moveDown()

    doc.fontSize(14).text(`Devis #${quote.id}`)
    doc.moveDown()

    doc.fontSize(12).text(`Montant: ${quote.amount} ${quote.currency}`)
    doc.text(`Status: ${quote.status}`)
    doc.moveDown()

    doc.end()
    await new Promise((res) => doc.on('end', res))
    return Buffer.concat(chunks)
  }

  async generateInvoicePdfBuffer(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } })
    if (!invoice) throw new NotFoundException('Invoice not found')

    const PDFDocument = require('pdfkit')
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => null)

    // Header
    doc.fontSize(20).text('Company', { align: 'left' })
    doc.moveDown()

    doc.fontSize(14).text(`Facture #${invoice.id}`)
    doc.moveDown()

    doc.fontSize(12).text(`Client: ${invoice.clientName || '—'}`)
    doc.text(`Montant: ${invoice.amount} ${invoice.currency}`)
    doc.text(`TVA: ${invoice.tva ? 'Yes' : 'No'}`)
    doc.text(`Status: ${invoice.status}`)
    doc.moveDown()

    doc.end()
    await new Promise((res) => doc.on('end', res))
    return Buffer.concat(chunks)
  }

  async createCharge(companyId: string, data: any) {
    const d: any = { ...data }
    d.company = { connect: { id: companyId } }
    if ((d as any).tripId) {
      d.trip = { connect: { id: (d as any).tripId } }
      delete d.tripId
    }
    delete d.companyId
    return this.prisma.charge.create({ data: d })
  }

  async convertQuoteToInvoice(quoteId: string, options?: { markAccepted?: boolean }) {
    const quote = await this.prisma.quote.findUnique({ where: { id: quoteId } })
    if (!quote) throw new NotFoundException('Quote not found')

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId: quote.companyId,
        tripId: quote.tripId,
        amount: quote.amount,
        currency: quote.currency,
        tva: false,
        status: 'DRAFT',
      }
    })

    if (options?.markAccepted) {
      await this.prisma.quote.update({ where: { id: quoteId }, data: { status: 'ACCEPTED' } })
    }

    return invoice
  }

  async getDashboardStats(companyId: string, opts?: { start?: Date; end?: Date; driverId?: string; vehicleId?: string }) {
    const start = opts?.start || new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = opts?.end || new Date()

    // 1. Totals (MongoDB Compatible)
    const totalRevenueRow = await this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { companyId, createdAt: { gte: start, lte: end } } })
    const totalChargesRow = await this.prisma.charge.aggregate({ _sum: { amount: true }, where: { companyId, createdAt: { gte: start, lte: end } } })
    const totalRevenue = totalRevenueRow._sum.amount || 0
    const totalCharges = totalChargesRow._sum.amount || 0

    // 2. Monthly Revenue/Charges (Manual Grouping for MongoDB)
    const invoices = await this.prisma.invoice.findMany({
      where: { companyId, createdAt: { gte: start, lte: end } },
      select: { amount: true, createdAt: true }
    })
    const charges = await this.prisma.charge.findMany({
      where: { companyId, createdAt: { gte: start, lte: end } },
      select: { amount: true, createdAt: true }
    })

    const groupData = (items: any[]) => {
      const groups: Record<string, number> = {}
      items.forEach(it => {
        const month = it.createdAt.toISOString().slice(0, 7) // "YYYY-MM"
        groups[month] = (groups[month] || 0) + (it.amount || 0)
      })
      return Object.entries(groups).map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month))
    }

    const monthlyRevenue = groupData(invoices)
    const monthlyCharges = groupData(charges)

    // 3. Driver Stats (MongoDB safe version - finding relationships)
    const drivers = await this.prisma.driver.findMany({
      where: { companyId },
      include: {
        trips: {
          where: { createdAt: { gte: start, lte: end } }
        }
      }
    })

    const driverStats = drivers.map(d => ({
      driverName: d.name,
      tripCount: d.trips.length,
      completedTrips: d.trips.filter(t => t.status === 'DONE').length,
      avgTripDuration: d.trips.length > 0 ? 4.5 : 0 // Placeholder for duration logic
    })).sort((a, b) => b.tripCount - a.tripCount)

    // 4. Recent Trips
    const recentTrips = await this.prisma.trip.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { driver: true, vehicle: true }
    })

    return {
      totalRevenue,
      totalCharges,
      totalProfit: totalRevenue - totalCharges,
      monthlyRevenue,
      monthlyCharges,
      tripsByStatus: await this.prisma.trip.groupBy({ by: ['status'], _count: { status: true }, where: { companyId } }),
      recentTrips,
      driverActivity: {
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.trips.length > 0).length,
        driverStats
      },
      fleet: {
        total: await this.prisma.vehicle.count({ where: { companyId } }),
        active: await this.prisma.vehicle.count({ where: { companyId, status: 'ACTIVE' } }),
        maintenance: await this.prisma.vehicle.count({ where: { companyId, status: 'MAINTENANCE' } }),
        available: await this.prisma.vehicle.count({ where: { companyId, status: 'AVAILABLE' } }),
      },
      fuel: await this.prisma.carburant.aggregate({
        _sum: { amountTTC: true, quantity: true, distance: true },
        where: { companyId, date: { gte: start, lte: end } }
      })
    }
  }
}
