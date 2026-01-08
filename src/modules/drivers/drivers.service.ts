import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDriverDto } from './dto/create-driver.dto'

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  create(companyId: string, data: CreateDriverDto) {
    const d: any = { ...data, role: 'DRIVER' }
    d.company = { connect: { id: companyId } }
    delete d.companyId
    return this.prisma.user.create({ data: d })
  }

  findAll(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
        role: 'DRIVER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        createdAt: true
      }
    })
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        createdAt: true
      }
    })
  }

  update(id: string, data: Partial<CreateDriverDto>) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        createdAt: true
      }
    })
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }

  getMyProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        createdAt: true
      }
    })
  }

  updateMyProfile(userId: string, data: any, file?: Express.Multer.File) {
    if (file) {
      data.photo = file.filename
    }
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        photo: true,
        licenseNumber: true,
        licenseExpiry: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        createdAt: true
      }
    })
  }
}
