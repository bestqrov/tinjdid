import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'

@Controller('companies')
export class CompaniesController {
  constructor(private svc: CompaniesService) {}

  @Post()
  create(@Body() body: CreateCompanyDto) {
    return this.svc.create(body)
  }

  @Get()
  findAll() {
    return this.svc.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateCompanyDto>) {
    return this.svc.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
