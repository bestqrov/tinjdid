import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { ConsommationService } from './consommation.service';
import { CreateCarburantDto, CreateAutoRouteDto, CreateDepenseDto, CreateServiceDto, CreateFraisGenerauxDto, CreateRechargeCarteDto } from './dto';

@Controller('consommation')
@UseGuards(JwtGuard)
export class ConsommationController {
  constructor(private readonly consommationService: ConsommationService) { }

  // Carburant endpoints
  @Post('carburant')
  @UseInterceptors(FileInterceptor('attachment'))
  async createCarburant(@Body() dto: CreateCarburantDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.createCarburant(req.companyId, dto, file);
  }

  @Get('carburant')
  async getAllCarburant(@Req() req: any) {
    return this.consommationService.getAllCarburant(req.companyId);
  }

  @Get('carburant/:id')
  async getCarburantById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getCarburantById(id, req.companyId);
  }

  @Put('carburant/:id')
  @UseInterceptors(FileInterceptor('attachment'))
  async updateCarburant(@Param('id') id: string, @Body() dto: CreateCarburantDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.updateCarburant(id, req.companyId, dto, file);
  }

  @Delete('carburant/:id')
  async deleteCarburant(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteCarburant(id, req.companyId);
  }

  // Autoroutes endpoints
  @Post('autoroutes')
  @UseInterceptors(FileInterceptor('attachment'))
  async createAutoroute(@Body() dto: CreateAutoRouteDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.createAutoroute(req.companyId, dto, file);
  }

  @Get('autoroutes')
  async getAllAutoroutes(@Req() req: any) {
    return this.consommationService.getAllAutoroutes(req.companyId);
  }

  @Get('autoroutes/:id')
  async getAutorouteById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getAutorouteById(id, req.companyId);
  }

  @Put('autoroutes/:id')
  @UseInterceptors(FileInterceptor('attachment'))
  async updateAutoroute(@Param('id') id: string, @Body() dto: CreateAutoRouteDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.updateAutoroute(id, req.companyId, dto, file);
  }

  @Delete('autoroutes/:id')
  async deleteAutoroute(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteAutoroute(id, req.companyId);
  }

  // Depenses endpoints
  @Post('depenses')
  @UseInterceptors(FileInterceptor('attachment'))
  async createDepense(@Body() dto: CreateDepenseDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.createDepense(req.companyId, dto, file);
  }

  @Get('depenses')
  async getAllDepenses(@Req() req: any) {
    return this.consommationService.getAllDepenses(req.companyId);
  }

  @Get('depenses/:id')
  async getDepenseById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getDepenseById(id, req.companyId);
  }

  @Put('depenses/:id')
  @UseInterceptors(FileInterceptor('attachment'))
  async updateDepense(@Param('id') id: string, @Body() dto: CreateDepenseDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.updateDepense(id, req.companyId, dto, file);
  }

  @Delete('depenses/:id')
  async deleteDepense(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteDepense(id, req.companyId);
  }

  // Services endpoints
  @Post('services')
  @UseInterceptors(FileInterceptor('attachment'))
  async createService(@Body() dto: CreateServiceDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.createService(req.companyId, dto, file);
  }

  @Get('services')
  async getAllServices(@Req() req: any) {
    return this.consommationService.getAllServices(req.companyId);
  }

  @Get('services/:id')
  async getServiceById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getServiceById(id, req.companyId);
  }

  @Put('services/:id')
  @UseInterceptors(FileInterceptor('attachment'))
  async updateService(@Param('id') id: string, @Body() dto: CreateServiceDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.updateService(id, req.companyId, dto, file);
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteService(id, req.companyId);
  }

  // Frais generaux endpoints
  @Post('frais-generaux')
  @UseInterceptors(FileInterceptor('attachment'))
  async createFraisGeneraux(@Body() dto: CreateFraisGenerauxDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.createFraisGeneraux(req.companyId, dto, file);
  }

  @Get('frais-generaux')
  async getAllFraisGeneraux(@Req() req: any) {
    return this.consommationService.getAllFraisGeneraux(req.companyId);
  }

  @Get('frais-generaux/:id')
  async getFraisGenerauxById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getFraisGenerauxById(id, req.companyId);
  }

  @Put('frais-generaux/:id')
  @UseInterceptors(FileInterceptor('attachment'))
  async updateFraisGeneraux(@Param('id') id: string, @Body() dto: CreateFraisGenerauxDto, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    return this.consommationService.updateFraisGeneraux(id, req.companyId, dto, file);
  }

  @Delete('frais-generaux/:id')
  async deleteFraisGeneraux(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteFraisGeneraux(id, req.companyId);
  }

  // Recharges cartes endpoints
  @Post('recharges-cartes')
  async createRechargeCartes(@Body() dto: CreateRechargeCarteDto, @Req() req: any) {
    return this.consommationService.createRechargeCartes(req.companyId, dto);
  }

  @Get('recharges-cartes')
  async getAllRechargesCartes(@Req() req: any) {
    return this.consommationService.getAllRechargesCartes(req.companyId);
  }

  @Get('recharges-cartes/:id')
  async getRechargeCartesById(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.getRechargeCartesById(id, req.companyId);
  }

  @Put('recharges-cartes/:id')
  async updateRechargeCartes(@Param('id') id: string, @Body() dto: CreateRechargeCarteDto, @Req() req: any) {
    return this.consommationService.updateRechargeCartes(id, req.companyId, dto);
  }

  @Delete('recharges-cartes/:id')
  async deleteRechargeCartes(@Param('id') id: string, @Req() req: any) {
    return this.consommationService.deleteRechargeCartes(id, req.companyId);
  }

  // Cartes endpoints
  @Get('cartes')
  async getAllCartes(@Req() req: any) {
    return this.consommationService.getAllCartes(req.companyId);
  }
}
