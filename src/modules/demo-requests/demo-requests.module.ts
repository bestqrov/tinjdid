import { Module } from '@nestjs/common'
import { DemoRequestsService } from './demo-requests.service'
import { DemoRequestsController } from './demo-requests.controller'
import { EmailService } from './email.service'
import { WhatsAppService } from './whatsapp.service'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService, EmailService, WhatsAppService],
  exports: [DemoRequestsService],
})
export class DemoRequestsModule {}
