import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common'
import { TripsService } from './trips.service'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('trips')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class TripsController {
  constructor(private svc: TripsService) {}

  @Post()
  @Roles('ADMIN','STAFF')
  create(@Query('companyId') companyId: string, @Body() body: any, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.create(cid, body)
  }

  @Get()
  @Roles('ADMIN','STAFF','DRIVER')
  findAll(@Query('companyId') companyId: string, @Req() req) {
    const cid = companyId || req.user.companyId
    return this.svc.findAll(cid)
  }

  @Get(':id')
  @Roles('ADMIN','STAFF','DRIVER')
  findOne(@Param('id') id: string, @Req() req) {
    const trip = this.svc.findOne(id)
    // controller trusts service for tenant scoping; alternatively service can verify
    return trip
  }

  @Get(':id/profit')
  @Roles('ADMIN','STAFF')
  profit(@Param('id') id: string, @Req() req) {
    return this.svc.profitForTrip(id)
  }
}
