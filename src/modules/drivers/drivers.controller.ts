import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common'
import { DriversService } from './drivers.service'
import { CreateDriverDto } from './dto/create-driver.dto'
import { UpdateDriverDto } from './dto/update-driver.dto'
import { JwtGuard } from '../../common/guards/jwt.guard'

@Controller('drivers')
export class DriversController {
  constructor(private svc: DriversService) {}

  @Post()
  create(@Query('companyId') companyId: string, @Body() body: CreateDriverDto) {
    return this.svc.create(companyId, body)
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.svc.findAll(companyId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateDriverDto) {
    return this.svc.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMyProfile(@Request() req: any) {
    return this.svc.getMyProfile(req.user.id)
  }

  @UseGuards(JwtGuard)
  @Put('me')
  updateMyProfile(@Request() req: any, @Body() body: UpdateDriverDto) {
    const files = (req as any).files || []
    const photoFile = files.find((f: any) => f.fieldname === 'photo')
    return this.svc.updateMyProfile(req.user.id, body, photoFile)
  }
}
