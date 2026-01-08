import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarburantDto, CreateAutoRouteDto, CreateDepenseDto, CreateServiceDto, CreateFraisGenerauxDto, CreateRechargeCarteDto } from './dto';

@Injectable()
export class ConsommationService {
  constructor(private prisma: PrismaService) {}

  // Carburant methods
  async createCarburant(companyId: string, dto: CreateCarburantDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId,
      date: new Date(dto.date),
      attachment: file?.filename,
    };
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.carburant.create({
      data,
    });
  }

  async getAllCarburant(companyId: string) {
    return this.prisma.carburant.findMany({
      where: { companyId },
      include: { vehicle: true },
    });
  }

  async getCarburantById(id: string, companyId: string) {
    return this.prisma.carburant.findFirst({
      where: { id, companyId },
      include: { vehicle: true },
    });
  }

  async updateCarburant(id: string, companyId: string, dto: CreateCarburantDto, file?: Express.Multer.File) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (file) {
      data.attachment = file.filename;
    }
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.carburant.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteCarburant(id: string, companyId: string) {
    return this.prisma.carburant.deleteMany({
      where: { id, companyId },
    });
  }

  // Autoroutes methods
  async createAutoroute(companyId: string, dto: CreateAutoRouteDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId,
      date: new Date(dto.date),
      attachment: file?.filename,
    };
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.autoroute.create({
      data,
    });
  }

  async getAllAutoroutes(companyId: string) {
    return this.prisma.autoroute.findMany({
      where: { companyId },
      include: { vehicle: true },
    });
  }

  async getAutorouteById(id: string, companyId: string) {
    return this.prisma.autoroute.findFirst({
      where: { id, companyId },
      include: { vehicle: true },
    });
  }

  async updateAutoroute(id: string, companyId: string, dto: CreateAutoRouteDto, file?: Express.Multer.File) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (file) {
      data.attachment = file.filename;
    }
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.autoroute.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteAutoroute(id: string, companyId: string) {
    return this.prisma.autoroute.deleteMany({
      where: { id, companyId },
    });
  }

  // Depenses methods
  async createDepense(companyId: string, dto: CreateDepenseDto, file?: Express.Multer.File) {
    return this.prisma.depense.create({
      data: {
        ...dto,
        companyId,
        date: new Date(dto.date),
        attachment: file?.filename,
      },
    });
  }

  async getAllDepenses(companyId: string) {
    return this.prisma.depense.findMany({
      where: { companyId },
    });
  }

  async getDepenseById(id: string, companyId: string) {
    return this.prisma.depense.findFirst({
      where: { id, companyId },
    });
  }

  async updateDepense(id: string, companyId: string, dto: CreateDepenseDto, file?: Express.Multer.File) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (file) {
      data.attachment = file.filename;
    }

    return this.prisma.depense.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteDepense(id: string, companyId: string) {
    return this.prisma.depense.deleteMany({
      where: { id, companyId },
    });
  }

  // Services methods
  async createService(companyId: string, dto: CreateServiceDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId,
      date: new Date(dto.date),
      attachment: file?.filename,
    };
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.service.create({
      data,
    });
  }

  async getAllServices(companyId: string) {
    return this.prisma.service.findMany({
      where: { companyId },
      include: { vehicle: true },
    });
  }

  async getServiceById(id: string, companyId: string) {
    return this.prisma.service.findFirst({
      where: { id, companyId },
      include: { vehicle: true },
    });
  }

  async updateService(id: string, companyId: string, dto: CreateServiceDto, file?: Express.Multer.File) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (file) {
      data.attachment = file.filename;
    }
    if (dto.vehicle) {
      data.vehicle = { connect: { id: dto.vehicle } };
      delete data.vehicle;
    }

    return this.prisma.service.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteService(id: string, companyId: string) {
    return this.prisma.service.deleteMany({
      where: { id, companyId },
    });
  }

  // Frais generaux methods
  async createFraisGeneraux(companyId: string, dto: CreateFraisGenerauxDto, file?: Express.Multer.File) {
    return this.prisma.fraisGeneraux.create({
      data: {
        ...dto,
        companyId,
        date: new Date(dto.date),
        attachment: file?.filename,
      },
    });
  }

  async getAllFraisGeneraux(companyId: string) {
    return this.prisma.fraisGeneraux.findMany({
      where: { companyId },
    });
  }

  async getFraisGenerauxById(id: string, companyId: string) {
    return this.prisma.fraisGeneraux.findFirst({
      where: { id, companyId },
    });
  }

  async updateFraisGeneraux(id: string, companyId: string, dto: CreateFraisGenerauxDto, file?: Express.Multer.File) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (file) {
      data.attachment = file.filename;
    }

    return this.prisma.fraisGeneraux.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteFraisGeneraux(id: string, companyId: string) {
    return this.prisma.fraisGeneraux.deleteMany({
      where: { id, companyId },
    });
  }

  // Recharges cartes methods
  async createRechargeCartes(companyId: string, dto: CreateRechargeCarteDto) {
    const data: any = {
      ...dto,
      companyId,
      date: new Date(dto.date),
    };
    if (dto.card) {
      data.carte = { connect: { id: dto.card } };
      delete data.card;
    }

    return this.prisma.rechargeCarte.create({
      data,
    });
  }

  async getAllRechargesCartes(companyId: string) {
    return this.prisma.rechargeCarte.findMany({
      where: { companyId },
      include: { carte: true },
    });
  }

  async getRechargeCartesById(id: string, companyId: string) {
    return this.prisma.rechargeCarte.findFirst({
      where: { id, companyId },
      include: { carte: true },
    });
  }

  async updateRechargeCartes(id: string, companyId: string, dto: CreateRechargeCarteDto) {
    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }
    if (dto.card) {
      data.carte = { connect: { id: dto.card } };
      delete data.card;
    }

    return this.prisma.rechargeCarte.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async deleteRechargeCartes(id: string, companyId: string) {
    return this.prisma.rechargeCarte.deleteMany({
      where: { id, companyId },
    });
  }

  // Cartes methods
  async getAllCartes(companyId: string) {
    return this.prisma.carte.findMany({
      where: { companyId },
    });
  }
}
