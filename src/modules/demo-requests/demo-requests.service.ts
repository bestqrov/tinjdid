import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDemoRequestDto } from './dto/create-demo-request.dto'
import { UpdateDemoRequestDto } from './dto/update-demo-request.dto'
import { EmailService } from './email.service'
import { WhatsAppService } from './whatsapp.service'

@Injectable()
export class DemoRequestsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private whatsappService: WhatsAppService,
  ) {}

  async create(createDemoRequestDto: CreateDemoRequestDto) {
    const demoRequest = await this.prisma.demoRequest.create({
      data: createDemoRequestDto,
    })

    // Send notifications (async, non-blocking)
    this.emailService.sendDemoRequestNotification(demoRequest).catch(err => {
      console.error('Email notification failed:', err)
    })

    this.whatsappService.sendDemoAlert(demoRequest).catch(err => {
      console.error('WhatsApp notification failed:', err)
    })

    return demoRequest
  }

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {}
    
    return this.prisma.demoRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const demoRequest = await this.prisma.demoRequest.findUnique({
      where: { id },
    })

    if (!demoRequest) {
      throw new NotFoundException(`Demo request with ID ${id} not found`)
    }

    return demoRequest
  }

  async update(id: string, updateDemoRequestDto: UpdateDemoRequestDto) {
    await this.findOne(id) // Check if exists

    return this.prisma.demoRequest.update({
      where: { id },
      data: updateDemoRequestDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id) // Check if exists

    return this.prisma.demoRequest.delete({
      where: { id },
    })
  }

  async getStats() {
    const [total, newCount, contacted, converted, rejected] = await Promise.all([
      this.prisma.demoRequest.count(),
      this.prisma.demoRequest.count({ where: { status: 'NEW' } }),
      this.prisma.demoRequest.count({ where: { status: 'CONTACTED' } }),
      this.prisma.demoRequest.count({ where: { status: 'CONVERTED' } }),
      this.prisma.demoRequest.count({ where: { status: 'REJECTED' } }),
    ])

    return {
      total,
      new: newCount,
      contacted,
      converted,
      rejected,
      conversionRate: total > 0 ? ((converted / total) * 100).toFixed(2) : 0,
    }
  }
}
