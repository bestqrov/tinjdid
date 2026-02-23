import { Module } from '@nestjs/common';
import { CartesController } from './cartes.controller';
import { CartesService } from './cartes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartesController],
  providers: [CartesService],
  exports: [CartesService],
})
export class CartesModule {}
