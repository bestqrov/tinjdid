import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { DemoRequestsService } from './demo-requests.service'
import { CreateDemoRequestDto } from './dto/create-demo-request.dto'
import { UpdateDemoRequestDto } from './dto/update-demo-request.dto'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  // Public endpoint - no auth required
  @Post()
  create(@Body() createDemoRequestDto: CreateDemoRequestDto) {
    return this.demoRequestsService.create(createDemoRequestDto)
  }

  // Super-admin endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  findAll(@Query('status') status?: string) {
    return this.demoRequestsService.findAll(status)
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  getStats() {
    return this.demoRequestsService.getStats()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  findOne(@Param('id') id: string) {
    return this.demoRequestsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  update(@Param('id') id: string, @Body() updateDemoRequestDto: UpdateDemoRequestDto) {
    return this.demoRequestsService.update(id, updateDemoRequestDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.demoRequestsService.remove(id)
  }
}
