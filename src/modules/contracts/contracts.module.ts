import { Module } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { ContractsController } from './contracts.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  providers: [ContractsService, PrismaService],
  controllers: [ContractsController],
})
export class ContractsModule {}
