import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { VehiclesService } from './vehicles.service'
import { VehiclesController } from './vehicles.controller'
import { PrismaService } from '../../prisma/prisma.service'

@Module({
	imports: [
		MulterModule.register({
			dest: './uploads/vehicles',
		})
	],
	providers: [VehiclesService, PrismaService],
	controllers: [VehiclesController],
	exports: [VehiclesService],
})
export class VehiclesModule {}
