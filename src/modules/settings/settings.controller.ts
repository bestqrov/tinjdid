import { Controller, Get, Put, Body, UseGuards, UseInterceptors, UploadedFile, Request, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { SettingsService } from './settings.service';
import { UpdateCompanyProfileDto, UpdateAppearanceDto, UpdateBackupDto, UpdateSecurityDto } from './dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('settings')
@UseGuards(JwtGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  // Company Profile
  @Get('company-profile')
  async getCompanyProfile(@Req() req: any) {
    return this.settingsService.getCompanyProfile(req.companyId);
  }

  @Put('company-profile')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './dist/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateCompanyProfile(@Req() req: any, @Body() dto: UpdateCompanyProfileDto, @UploadedFile() file?: Express.Multer.File) {
    return this.settingsService.updateCompanyProfile(req.companyId, dto, file);
  }

  // Appearance Settings
  @Get('appearance')
  async getAppearance(@Req() req: any) {
    return this.settingsService.getAppearance(req.companyId);
  }

  @Put('appearance')
  async updateAppearance(@Req() req: any, @Body() dto: UpdateAppearanceDto) {
    return this.settingsService.updateAppearance(req.companyId, dto);
  }

  // Backup Settings
  @Get('backup')
  async getBackup(@Req() req: any) {
    return this.settingsService.getBackup(req.companyId);
  }

  @Put('backup')
  async updateBackup(@Req() req: any, @Body() dto: UpdateBackupDto) {
    return this.settingsService.updateBackup(req.companyId, dto);
  }

  // Security Settings
  @Get('security')
  async getSecurity(@Req() req: any) {
    return this.settingsService.getSecurity(req.companyId);
  }

  @Put('security')
  async updateSecurity(@Req() req: any, @Body() dto: UpdateSecurityDto) {
    return this.settingsService.updateSecurity(req.companyId, dto);
  }

  // System Info
  @Get('system-info')
  async getSystemInfo() {
    return this.settingsService.getSystemInfo();
  }
}
