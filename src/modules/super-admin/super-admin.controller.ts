import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { UpdateCompanyStatusDto, AssignPlanDto } from './dto/company.dto';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // Dashboard Overview
  @Get('dashboard')
  async getDashboard() {
    return this.superAdminService.getDashboardOverview();
  }

  @Get('dashboard/stats')
  async getStats(@Query('period') period?: string) {
    return this.superAdminService.getStatistics(period || '30');
  }

  @Get('dashboard/charts')
  async getCharts(@Query('period') period?: string) {
    return this.superAdminService.getChartData(period || '90');
  }

  // Companies Management
  @Get('companies')
  async getCompanies(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.superAdminService.getCompanies({
      status,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('companies/:id')
  async getCompany(@Param('id') id: string) {
    return this.superAdminService.getCompanyDetails(id);
  }

  @Put('companies/:id/status')
  async updateCompanyStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyStatusDto,
  ) {
    return this.superAdminService.updateCompanyStatus(id, dto);
  }

  @Put('companies/:id/plan')
  async assignPlan(@Param('id') id: string, @Body() dto: AssignPlanDto) {
    return this.superAdminService.assignPlanToCompany(id, dto);
  }

  @Delete('companies/:id')
  async deleteCompany(@Param('id') id: string) {
    return this.superAdminService.deleteCompany(id);
  }

  // Plans Management
  @Get('plans')
  async getPlans() {
    return this.superAdminService.getPlans();
  }

  @Get('plans/:id')
  async getPlan(@Param('id') id: string) {
    return this.superAdminService.getPlanDetails(id);
  }

  @Post('plans')
  async createPlan(@Body() dto: CreatePlanDto) {
    return this.superAdminService.createPlan(dto);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.superAdminService.updatePlan(id, dto);
  }

  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    return this.superAdminService.deletePlan(id);
  }

  // Revenue & Finance
  @Get('revenue')
  async getRevenue(@Query('period') period?: string) {
    return this.superAdminService.getRevenueStats(period || '30');
  }

  @Get('revenue/by-plan')
  async getRevenueByPlan(@Query('period') period?: string) {
    return this.superAdminService.getRevenueByPlan(period || '30');
  }

  @Get('revenue/export')
  async exportRevenue(@Query('format') format: string = 'csv') {
    return this.superAdminService.exportRevenueData(format);
  }

  // Users Management
  @Get('users')
  async getAllUsers(
    @Query('companyId') companyId?: string,
    @Query('role') role?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.superAdminService.getAllUsers({
      companyId,
      role,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
    });
  }

  @Put('users/:id/block')
  async blockUser(@Param('id') id: string) {
    return this.superAdminService.blockUser(id);
  }

  @Put('users/:id/unblock')
  async unblockUser(@Param('id') id: string) {
    return this.superAdminService.unblockUser(id);
  }

  @Post('users/:id/reset-password')
  async resetUserPassword(@Param('id') id: string) {
    return this.superAdminService.resetUserPassword(id);
  }

  // Activity Logs
  @Get('logs')
  async getActivityLogs(
    @Query('companyId') companyId?: string,
    @Query('action') action?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.superAdminService.getActivityLogs({
      companyId,
      action,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 100,
    });
  }

  @Post('logs')
  async createLog(@Body() logData: any) {
    return this.superAdminService.createActivityLog(logData);
  }

  // System Health
  @Get('system/health')
  async getSystemHealth() {
    return this.superAdminService.getSystemHealth();
  }

  @Get('system/errors')
  async getSystemErrors(@Query('limit') limit?: string) {
    return this.superAdminService.getRecentErrors(limit ? parseInt(limit) : 50);
  }

  // Platform Settings
  @Get('settings')
  async getSettings() {
    return this.superAdminService.getPlatformSettings();
  }

  @Put('settings')
  async updateSettings(@Body() settings: any) {
    return this.superAdminService.updatePlatformSettings(settings);
  }

  // Password Reset Requests Management
  @Get('password-reset-requests')
  async getPasswordResetRequests(@Query('status') status?: string) {
    return this.superAdminService.getPasswordResetRequests(status);
  }

  @Post('password-reset-requests/:id/respond')
  async respondToPasswordResetRequest(
    @Param('id') id: string,
    @Body() body: { response: string; sendEmail: boolean; newPassword?: string }
  ) {
    return this.superAdminService.respondToPasswordResetRequest(id, body);
  }

  @Put('password-reset-requests/:id/status')
  async updatePasswordResetRequestStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    return this.superAdminService.updatePasswordResetRequestStatus(id, body.status);
  }}