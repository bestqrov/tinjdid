import { Body, Controller, Get, Param, Post, Query, UseGuards, Req, Delete, HttpCode, Put } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('invoices')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class InvoicesController {
  constructor(private svc: InvoicesService) {}

  @Post()
  @Roles('ADMIN','STAFF')
  create(@Query('companyId') companyId: string, @Body() body: CreateInvoiceDto, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.create(cid, body)
  }

  @Get()
  @Roles('ADMIN','STAFF')
  findAll(@Query('companyId') companyId: string, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.findAll(cid)
  }

  @Get(':id')
  @Roles('ADMIN','STAFF','DRIVER')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN','STAFF')
  update(@Param('id') id: string, @Body() body: UpdateInvoiceDto) {
    return this.svc.update(id, body)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN','STAFF')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
