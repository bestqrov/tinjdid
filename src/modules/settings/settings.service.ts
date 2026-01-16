import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyProfileDto, UpdateAppearanceDto, UpdateBackupDto, UpdateSecurityDto } from './dto';
import * as sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) { }

  // Company Profile
  async getCompanyProfile(companyId: string) {
    const profile = await this.prisma.companyProfile.findUnique({
      where: { companyId: companyId },
    });

    return {
      data: profile || {
        logo: '',
        name: '',
        tagline: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        country: '',
      },
      message: 'Company profile retrieved successfully',
    };
  }

  async updateCompanyProfile(companyId: string, dto: UpdateCompanyProfileDto, file?: Express.Multer.File) {
    let logoPath = dto.logo;

    // Process uploaded logo
    if (file && file.path) {
      try {
        // Use the dist/uploads directory that's served by the backend
        const uploadsDir = join(process.cwd(), 'dist', 'uploads');
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `logo-${Date.now()}.png`;
        const outputPath = join(uploadsDir, filename);

        // Resize logo to 200x200 and convert to PNG
        await sharp(file.path)
          .resize(200, 200, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toFile(outputPath);

        logoPath = `/uploads/${filename}`;
      } catch (error) {
        console.error('Error processing logo:', error);
        // If error, use the original file path
        logoPath = file ? `/uploads/${file.filename}` : dto.logo;
      }
    }

    const profile = await this.prisma.companyProfile.upsert({
      where: { companyId: companyId },
      update: {
        logo: logoPath,
        name: dto.name,
        gerantNom: dto.gerantNom,
        activite: dto.activite,
        slogan: dto.slogan,
        tagline: dto.tagline,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        address: dto.address,
        country: dto.country,
        if: dto.if,
        cnss: dto.cnss,
        ice: dto.ice,
        rc: dto.rc,
        patente: dto.patente,
        compteBancaire: dto.compteBancaire,
      },
      create: {
        companyId: companyId,
        logo: logoPath,
        name: dto.name,
        gerantNom: dto.gerantNom,
        activite: dto.activite,
        slogan: dto.slogan,
        tagline: dto.tagline,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        address: dto.address,
        country: dto.country,
        if: dto.if,
        cnss: dto.cnss,
        ice: dto.ice,
        rc: dto.rc,
        patente: dto.patente,
        compteBancaire: dto.compteBancaire,
      },
    });

    return {
      data: profile,
      message: 'Company profile updated successfully',
    };
  }

  // Appearance Settings
  async getAppearance(companyId: string) {
    let settings = await this.prisma.appSettings.findUnique({
      where: { companyId: companyId },
    });

    if (!settings) {
      settings = await this.prisma.appSettings.create({
        data: { companyId: companyId, theme: 'light' },
      });
    }

    return {
      data: settings,
      message: 'Appearance settings retrieved successfully',
    };
  }

  async updateAppearance(companyId: string, dto: UpdateAppearanceDto) {
    const settings = await this.prisma.appSettings.upsert({
      where: { companyId: companyId },
      update: { theme: dto.theme },
      create: { companyId: companyId, theme: dto.theme },
    });

    return {
      data: settings,
      message: 'Appearance settings updated successfully',
    };
  }

  // Backup Settings
  async getBackup(companyId: string) {
    // Note: Model for backup settings not yet in schema, using companyId scoping mock
    return {
      data: {
        companyId,
        frequency: 'daily',
        storage: 'local',
      },
      message: 'Backup settings retrieved successfully',
    };
  }

  async updateBackup(companyId: string, dto: UpdateBackupDto) {
    return {
      data: { ...dto, companyId },
      message: 'Backup settings updated successfully',
    };
  }

  // Security Settings
  async getSecurity(companyId: string) {
    // Note: Model for security settings not yet in schema, using companyId scoping mock
    return {
      data: {
        companyId,
        twoFactorEnabled: false,
        passwordPolicy: 'medium',
      },
      message: 'Security settings retrieved successfully',
    };
  }

  async updateSecurity(companyId: string, dto: UpdateSecurityDto) {
    return {
      data: { ...dto, companyId },
      message: 'Security settings updated successfully',
    };
  }

  // System Info
  async getSystemInfo() {
    return {
      data: {
        version: '1.0.0',
        lastUpdate: new Date().toISOString(),
        updateAvailable: false,
      },
      message: 'System info retrieved successfully',
    };
  }
}
