import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCompanyDto } from './dto/create-company.dto'

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCompanyDto) {
    // Set trial period to 15 days if status is TRIAL
    const companyData: any = { ...data }
    if (!companyData.status || companyData.status === 'TRIAL') {
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 15)
      companyData.trialEndsAt = trialEndDate
      companyData.status = 'TRIAL'
    }
    return this.prisma.company.create({ data: companyData })
  }

  findAll() {
    return this.prisma.company.findMany()
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id } })
  }

  update(id: string, data: Partial<CreateCompanyDto>) {
    return this.prisma.company.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.company.delete({ where: { id } })
  }
}
