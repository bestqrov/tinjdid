import { Module } from '@nestjs/common';
import { ConsommationController } from './consommation.controller';
import { ConsommationService } from './consommation.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsommationController],
  providers: [ConsommationService],
  exports: [ConsommationService],
})
export class ConsommationModule {}
