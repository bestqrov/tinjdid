import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  providers: [PrismaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
