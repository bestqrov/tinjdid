import { Module } from '@nestjs/common'
import { DriversService } from './drivers.service'
import { DriversController } from './drivers.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
	providers: [DriversService, PrismaService],
	controllers: [DriversController],
})
export class DriversModule {}
