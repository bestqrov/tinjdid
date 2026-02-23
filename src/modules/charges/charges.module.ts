import { Module } from '@nestjs/common'
import { ChargesService } from './charges.service'
import { ChargesController } from './charges.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  providers: [ChargesService, PrismaService],
  controllers: [ChargesController],
})
export class ChargesModule {}
