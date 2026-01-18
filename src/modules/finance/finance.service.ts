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
    const start = opts?.start || new Date(new Date().getFullYear(), 0, 1)
    const end = opts?.end || new Date()

    // Totals
    // Note: $queryRaw is SQL-specific and will fail on MongoDB. Need refactoring.
    const revenueResult: any[] = await (this.prisma as any).$queryRaw`
      SELECT strftime('%Y-%m-01 00:00:00', "createdAt") as month, SUM(amount) as total
      FROM "Invoice"
      WHERE "companyId" = ${companyId} AND "createdAt" BETWEEN ${start} AND ${end}
      GROUP BY month ORDER BY month
    `

    const chargesResult: any[] = await (this.prisma as any).$queryRaw`
      SELECT strftime('%Y-%m-01 00:00:00', "createdAt") as month, SUM(amount) as total
      FROM "Charge"
      WHERE "companyId" = ${companyId} AND "createdAt" BETWEEN ${start} AND ${end}
      GROUP BY month ORDER BY month
    `

    const totalRevenueRow: any = await this.prisma.invoice.aggregate({ _sum: { amount: true }, where: { companyId: companyId, createdAt: { gte: start, lte: end } } })
    const totalChargesRow: any = await this.prisma.charge.aggregate({ _sum: { amount: true }, where: { companyId: companyId, createdAt: { gte: start, lte: end } } })

    const tripsByStatus = await this.prisma.trip.groupBy({ by: ['status'], _count: { status: true }, where: { companyId: companyId } })

    // Driver activity analytics
    const driverTripStats: any[] = await (this.prisma as any).$queryRaw`
      SELECT 
        d.name as driverName,
        COUNT(t.id) as tripCount,
        SUM(CASE WHEN t.status = 'DONE' THEN 1 ELSE 0 END) as completedTrips,
        AVG(CASE WHEN t.status = 'DONE' THEN (julianday(t.updatedAt) - julianday(t.createdAt)) * 24 ELSE NULL END) as avgTripDuration
      FROM "Driver" d
      LEFT JOIN "Trip" t ON d.id = t.driverId AND t."companyId" = ${companyId} AND t."createdAt" BETWEEN ${start} AND ${end}
      WHERE d."companyId" = ${companyId}
      GROUP BY d.id, d.name
      ORDER BY tripCount DESC
    `

    const totalDrivers = await this.prisma.driver.count({ where: { companyId: companyId } })
    const activeDrivers = await this.prisma.driver.count({
      where: {
        companyId: companyId,
        trips: {
          some: {
            createdAt: { gte: start, lte: end }
          }
        }
      }
    })

    // map monthly arrays
    const monthlyRevenue = revenueResult.map((r) => ({ month: r.month, total: parseFloat(r.total) }))
    const monthlyCharges = chargesResult.map((r) => ({ month: r.month, total: parseFloat(r.total) }))

    const totalRevenue = totalRevenueRow._sum.amount || 0
    const totalCharges = totalChargesRow._sum.amount || 0
    const totalProfit = totalRevenue - totalCharges

    return {
      totalRevenue,
      totalCharges,
      totalProfit,
      monthlyRevenue,
      monthlyCharges,
      tripsByStatus,
      driverActivity: {
        totalDrivers,
        activeDrivers,
        driverStats: driverTripStats.map(d => ({
          driverName: d.drivername,
          tripCount: parseInt(d.tripcount),
          completedTrips: parseInt(d.completedtrips),
          avgTripDuration: d.avgtripduration ? parseFloat(d.avgtripduration) : null
        }))
      },
      // New Analytics
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
