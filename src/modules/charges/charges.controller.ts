import { Body, Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common'
import { ChargesService } from './charges.service'
import { CreateChargeDto } from './dto/create-charge.dto'
import { UpdateChargeDto } from './dto/update-charge.dto'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('charges')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class ChargesController {
  constructor(private svc: ChargesService) {}

  @Post()
  @Roles('ADMIN','STAFF')
  create(@Query('companyId') companyId: string, @Body() body: CreateChargeDto, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.create(cid, body)
  }

  @Get()
  @Roles('ADMIN','STAFF')
  findAll(@Query('companyId') companyId: string, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.findAll(cid)
  }

  @Get('by-trip')
  @Roles('ADMIN','STAFF','DRIVER')
  findForTrip(@Query('tripId') tripId: string) {
    return this.svc.findForTrip(tripId)
  }
}
