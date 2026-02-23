import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common'
import { QuotesService } from './quotes.service'
import { CreateQuoteDto } from './dto/create-quote.dto'
import { UpdateQuoteDto } from './dto/update-quote.dto'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('quotes')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class QuotesController {
  constructor(private svc: QuotesService) {}

  @Post()
  @Roles('ADMIN','STAFF')
  create(@Query('companyId') companyId: string, @Body() body: CreateQuoteDto, @Req() req) {
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

  @Post(':id/convert-to-trip')
  @Roles('ADMIN','STAFF')
  convert(@Param('id') id: string) {
    return this.svc.convertToTrip(id)
  }
}
