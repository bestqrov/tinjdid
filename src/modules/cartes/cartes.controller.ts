import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CartesService } from './cartes.service';
import { CreateCarteDto, UpdateCarteDto } from './dto';

@Controller('cartes')
@UseGuards(JwtGuard)
export class CartesController {
  constructor(private readonly cartesService: CartesService) { }

  @Post()
  async create(@Body() dto: CreateCarteDto, @Req() req: any) {
    return this.cartesService.create(req.companyId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.cartesService.findAll(req.companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.cartesService.findOne(id, req.companyId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCarteDto, @Req() req: any) {
    return this.cartesService.update(id, req.companyId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.cartesService.remove(id, req.companyId);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string, @Req() req: any) {
    return this.cartesService.activate(id, req.companyId);
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id') id: string, @Req() req: any) {
    return this.cartesService.deactivate(id, req.companyId);
  }
}
