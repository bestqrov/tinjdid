import { Module } from '@nestjs/common'
import { QuotesService } from './quotes.service'
import { QuotesController } from './quotes.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
  providers: [QuotesService, PrismaService],
  controllers: [QuotesController],
})
export class QuotesModule {}
