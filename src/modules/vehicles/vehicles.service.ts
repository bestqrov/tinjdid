import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) { }

  create(companyId: string, data: CreateVehicleDto) {
    const d: any = { ...data }
    // Copy immatricule to plate for legacy compatibility
    if (d.immatricule && !d.plate) {
      d.plate = d.immatricule
    }
    d.company = { connect: { id: companyId } }
    delete d.companyId
    return this.prisma.vehicle.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.vehicle.findMany({ where: { companyId: companyId } })
  }

  findOne(id: string) {
    return this.prisma.vehicle.findUnique({ where: { id: id } })
  }

  update(id: string, data: Partial<CreateVehicleDto>) {
    return this.prisma.vehicle.update({ where: { id: id }, data })
  }

  remove(id: string) {
    return this.prisma.vehicle.delete({ where: { id: id } })
  }
}
