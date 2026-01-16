import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarburantDto, CreateAutoRouteDto, CreateDepenseDto, CreateServiceDto, CreateFraisGenerauxDto, CreateRechargeCarteDto } from './dto';

@Injectable()
export class ConsommationService {
  constructor(private prisma: PrismaService) { }

  // Carburant methods
  async createCarburant(companyId: string, dto: CreateCarburantDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId: companyId,
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
      where: { companyId: companyId },
    });
  }

  async getCarburantById(id: string, companyId: string) {
    return this.prisma.carburant.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteCarburant(id: string, companyId: string) {
    return this.prisma.carburant.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Autoroutes methods
  async createAutoroute(companyId: string, dto: CreateAutoRouteDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId: companyId,
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
      where: { companyId: companyId },
    });
  }

  async getAutorouteById(id: string, companyId: string) {
    return this.prisma.autoroute.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteAutoroute(id: string, companyId: string) {
    return this.prisma.autoroute.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Depenses methods
  async createDepense(companyId: string, dto: CreateDepenseDto, file?: Express.Multer.File) {
    return this.prisma.depense.create({
      data: {
        ...dto,
        companyId: companyId,
        date: new Date(dto.date),
        attachment: file?.filename,
      },
    });
  }

  async getAllDepenses(companyId: string) {
    return this.prisma.depense.findMany({
      where: { companyId: companyId },
    });
  }

  async getDepenseById(id: string, companyId: string) {
    return this.prisma.depense.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteDepense(id: string, companyId: string) {
    return this.prisma.depense.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Services methods
  async createService(companyId: string, dto: CreateServiceDto, file?: Express.Multer.File) {
    const data: any = {
      ...dto,
      companyId: companyId,
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
      where: { companyId: companyId },
    });
  }

  async getServiceById(id: string, companyId: string) {
    return this.prisma.service.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteService(id: string, companyId: string) {
    return this.prisma.service.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Frais generaux methods
  async createFraisGeneraux(companyId: string, dto: CreateFraisGenerauxDto, file?: Express.Multer.File) {
    return this.prisma.fraisGeneraux.create({
      data: {
        ...dto,
        companyId: companyId,
        date: new Date(dto.date),
        attachment: file?.filename,
      },
    });
  }

  async getAllFraisGeneraux(companyId: string) {
    return this.prisma.fraisGeneraux.findMany({
      where: { companyId: companyId },
    });
  }

  async getFraisGenerauxById(id: string, companyId: string) {
    return this.prisma.fraisGeneraux.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteFraisGeneraux(id: string, companyId: string) {
    return this.prisma.fraisGeneraux.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Recharges cartes methods
  async createRechargeCartes(companyId: string, dto: CreateRechargeCarteDto) {
    const data: any = {
      ...dto,
      companyId: companyId,
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
      where: { companyId: companyId },
    });
  }

  async getRechargeCartesById(id: string, companyId: string) {
    return this.prisma.rechargeCarte.findFirst({
      where: { id: id, companyId: companyId },
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
      where: { id: id, companyId: companyId },
      data,
    });
  }

  async deleteRechargeCartes(id: string, companyId: string) {
    return this.prisma.rechargeCarte.deleteMany({
      where: { id: id, companyId: companyId },
    });
  }

  // Cartes methods
  async getAllCartes(companyId: string) {
    return this.prisma.carte.findMany({
      where: { companyId: companyId },
    });
  }
}
