import { Module } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  providers: [InvoicesService, PrismaService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
