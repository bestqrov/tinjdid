import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarteDto, UpdateCarteDto } from './dto';

@Injectable()
export class CartesService {
  constructor(private prisma: PrismaService) { }

  async create(companyId: string, dto: CreateCarteDto) {
    const data: any = { ...dto, companyId: companyId };
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.carte.create({
      data,
    });
  }

  async findAll(companyId: string) {
    return this.prisma.carte.findMany({
      where: { companyId: companyId },
    });
  }

  async findOne(id: string, companyId: string) {
    return this.prisma.carte.findFirst({
      where: { id: id, companyId: companyId },
    });
  }

  async update(id: string, companyId: string, dto: UpdateCarteDto) {
    const data: any = { ...dto };
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.carte.updateMany({
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async remove(id: string, companyId: string) {
    return this.prisma.carte.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  async activate(id: string, companyId: string) {
    return this.prisma.carte.updateMany({
      where: { id: id, companyId: companyId },
      data: { status: 'active' },
    });
  }

  async deactivate(id: string, companyId: string) {
    return this.prisma.carte.updateMany({
      where: { id: id, companyId: companyId },
      data: { status: 'inactive' },
    });
  }
}
