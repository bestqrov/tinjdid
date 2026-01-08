import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  create(companyId: string, data: any, attachmentPath?: string) {
    const payload: any = {
      company: { connect: { id: companyId } },
      collaborator: { connect: { id: data.collaboratorId } },
      number: data.number,
      contractType: data.contractTypeId ? { connect: { id: data.contractTypeId } } : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
      endDatePlanned: data.endDatePlanned ? new Date(data.endDatePlanned) : undefined,
      durationPlanned: data.durationPlanned ? Number(data.durationPlanned) : undefined,
      endDateReal: data.endDateReal ? new Date(data.endDateReal) : undefined,
      durationReal: data.durationReal ? Number(data.durationReal) : undefined,
      probationPeriod: data.probationPeriod ? Number(data.probationPeriod) : undefined,
      hours: data.hours ? Number(data.hours) : undefined,
      comment: data.comment,
      attachment: attachmentPath,
    }

    // remove undefined keys
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    return this.prisma.contract.create({ data: payload })
  }

  findAll(companyId: string) {
    return this.prisma.contract.findMany({ where: { companyId }, include: { collaborator: true, contractType: true } })
  }

  findMetadata(companyId: string) {
    return Promise.all([
      this.prisma.user.findMany({ where: { companyId }, select: { id: true, name: true, email: true } }),
      this.prisma.contractType.findMany({ where: { companyId } }),
    ]).then(([collaborators, contractTypes]) => ({ collaborators, contractTypes }))
  }
}
