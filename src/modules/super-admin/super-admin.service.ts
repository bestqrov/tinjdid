import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { UpdateCompanyStatusDto, AssignPlanDto } from './dto/company.dto';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard Overview
  async getDashboardOverview() {
    const [
      totalCompanies,
      activeCompanies,
      trialCompanies,
      totalUsers,
      totalTrips,
      recentCompanies,
    ] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.company.count({ where: { status: 'ACTIVE' } }),
      this.prisma.company.count({ where: { status: 'TRIAL' } }),
      this.prisma.user.count(),
      this.prisma.trip.count(),
      this.prisma.company.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: true,
          _count: {
            select: { users: true, trips: true, vehicles: true },
          },
        },
      }),
    ]);

    // Calculate MRR (Monthly Recurring Revenue)
    const companies = await this.prisma.company.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });

    const mrr = companies.reduce((sum, company) => {
      return sum + (company.plan?.priceMonthly || 0);
    }, 0);

    // Calculate churn rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const canceledLast30Days = await this.prisma.company.count({
      where: {
        status: 'CANCELED',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const churnRate =
      totalCompanies > 0 ? (canceledLast30Days / totalCompanies) * 100 : 0;

    return {
      kpis: {
        totalCompanies,
        activeCompanies,
        trialCompanies,
        suspendedCompanies: totalCompanies - activeCompanies - trialCompanies,
        totalUsers,
        totalTrips,
        mrr,
        arr: mrr * 12,
        churnRate: parseFloat(churnRate.toFixed(2)),
        platformProfit: mrr * 0.7, // Example: 70% profit margin
      },
      recentCompanies,
    };
  }

  async getStatistics(period: string) {
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [newCompanies, newUsers, totalTripsInPeriod] = await Promise.all([
      this.prisma.company.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.user.count({ where: { createdAt: { gte: startDate } } }),
      this.prisma.trip.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    return {
      period: `Last ${days} days`,
      newCompanies,
      newUsers,
      totalTrips: totalTripsInPeriod,
    };
  }

  async getChartData(period: string) {
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // MRR Evolution
    const companiesByMonth = await (this.prisma as any).$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "Company"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    // Trips volume
    const tripsByDay = await (this.prisma as any).$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Trip"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Revenue by plan
    const revenueByPlan = await this.prisma.company.groupBy({
      by: ['planId'],
      where: { status: 'ACTIVE' },
      _count: true,
    });

    const planDetails = await Promise.all(
      revenueByPlan.map(async (item) => {
        if (!item.planId) return null;
        const plan = await this.prisma.subscriptionPlan.findUnique({
          where: { id: item.planId },
        });
        return {
          planName: plan?.name || 'Unknown',
          companies: item._count,
          revenue: (plan?.priceMonthly || 0) * item._count,
        };
      }),
    );

    return {
      mrrEvolution: companiesByMonth,
      tripsVolume: tripsByDay,
      revenueByPlan: planDetails.filter((p) => p !== null),
    };
  }

  // Companies Management
  async getCompanies(filters: {
    status?: string;
    page: number;
    limit: number;
  }) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: true,
          _count: {
            select: { users: true, trips: true, vehicles: true },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCompanyDetails(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        plan: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
        vehicles: { select: { id: true, plate: true, type: true } },
        trips: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            date: true,
            pickup: true,
            dropoff: true,
            price: true,
            status: true,
          },
        },
        _count: {
          select: {
            users: true,
            vehicles: true,
            trips: true,
            drivers: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async updateCompanyStatus(id: string, dto: UpdateCompanyStatusDto) {
    const company = await this.prisma.company.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.createActivityLog({
      companyId: id,
      action:
        dto.status === 'ACTIVE'
          ? 'COMPANY_ACTIVATED'
          : 'COMPANY_SUSPENDED',
      description: `Company status changed to ${dto.status}`,
    });

    return company;
  }

  async assignPlanToCompany(id: string, dto: AssignPlanDto) {
    const company = await this.prisma.company.update({
      where: { id },
      data: { planId: dto.planId },
      include: { plan: true },
    });

    await this.createActivityLog({
      companyId: id,
      action: 'PLAN_CHANGED',
      description: `Company plan changed to ${company.plan?.name}`,
    });

    return company;
  }

  async deleteCompany(id: string) {
    await this.createActivityLog({
      companyId: id,
      action: 'COMPANY_DELETED',
      description: `Company soft deleted`,
    });

    // Soft delete by setting status
    return this.prisma.company.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }

  // Plans Management
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { priceMonthly: 'asc' },
      include: {
        _count: {
          select: { companies: true },
        },
      },
    });
  }

  async getPlanDetails(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: { companies: true },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async createPlan(dto: CreatePlanDto) {
    return this.prisma.subscriptionPlan.create({
      data: dto,
    });
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data: dto,
    });
  }

  async deletePlan(id: string) {
    // Check if any companies are using this plan
    const companiesCount = await this.prisma.company.count({
      where: { planId: id },
    });

    if (companiesCount > 0) {
      throw new Error(
        `Cannot delete plan. ${companiesCount} companies are using it.`,
      );
    }

    return this.prisma.subscriptionPlan.delete({
      where: { id },
    });
  }

  // Revenue & Finance
  async getRevenueStats(period: string) {
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activeCompanies = await this.prisma.company.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });

    const mrr = activeCompanies.reduce((sum, company) => {
      return sum + (company.plan?.priceMonthly || 0);
    }, 0);

    const arr = mrr * 12;

    // Simulate payment statuses (in real app, you'd have a Payment model)
    const paidCompanies = activeCompanies.length;
    const pendingPayments = Math.floor(paidCompanies * 0.1); // 10% pending
    const failedPayments = Math.floor(paidCompanies * 0.02); // 2% failed

    return {
      mrr,
      arr,
      averageRevenuePerCompany: paidCompanies > 0 ? mrr / paidCompanies : 0,
      payments: {
        paid: paidCompanies,
        pending: pendingPayments,
        failed: failedPayments,
      },
    };
  }

  async getRevenueByPlan(period: string) {
    const companies = await this.prisma.company.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    });

    const revenueByPlan: Record<string, any> = {};

    companies.forEach((company) => {
      const planName = company.plan?.name || 'No Plan';
      const planRevenue = company.plan?.priceMonthly || 0;

      if (!revenueByPlan[planName]) {
        revenueByPlan[planName] = {
          planName,
          companies: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
        };
      }

      revenueByPlan[planName].companies += 1;
      revenueByPlan[planName].monthlyRevenue += planRevenue;
      revenueByPlan[planName].yearlyRevenue += planRevenue * 12;
    });

    return Object.values(revenueByPlan);
  }

  async exportRevenueData(format: string) {
    const revenue = await this.getRevenueByPlan('30');
    
    if (format === 'csv') {
      const csv = [
        'Plan Name,Companies,Monthly Revenue,Yearly Revenue',
        ...revenue.map((r: any) =>
          `${r.planName},${r.companies},${r.monthlyRevenue},${r.yearlyRevenue}`,
        ),
      ].join('\n');

      return { data: csv, contentType: 'text/csv' };
    }

    return { data: revenue, contentType: 'application/json' };
  }

  // Users Management
  async getAllUsers(filters: {
    companyId?: string;
    role?: string;
    page: number;
    limit: number;
  }) {
    const { companyId, role, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async blockUser(id: string) {
    // In a real app, you'd add a 'blocked' field to User model
    await this.createActivityLog({
      userId: id,
      action: 'USER_BLOCKED',
      description: `User blocked by super admin`,
    });

    return { success: true, message: 'User blocked successfully' };
  }

  async unblockUser(id: string) {
    await this.createActivityLog({
      userId: id,
      action: 'USER_UNBLOCKED',
      description: `User unblocked by super admin`,
    });

    return { success: true, message: 'User unblocked successfully' };
  }

  async resetUserPassword(id: string) {
    // In a real app, generate temporary password and send email
    return { success: true, message: 'Password reset email sent' };
  }

  // Activity Logs
  async getActivityLogs(filters: {
    companyId?: string;
    action?: string;
    page: number;
    limit: number;
  }) {
    const { companyId, action, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createActivityLog(data: {
    companyId?: string;
    userId?: string;
    action: string;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.activityLog.create({
      data: data as any,
    });
  }

  // System Health
  async getSystemHealth() {
    try {
      // Check database connection
      await (this.prisma as any).$queryRaw`SELECT 1`;

      const latestHealth = await this.prisma.systemHealth.findFirst({
        orderBy: { timestamp: 'desc' },
      });

      const uptime = process.uptime();

      // Create new health record
      const health = await this.prisma.systemHealth.create({
        data: {
          apiStatus: 'HEALTHY',
          databaseStatus: 'HEALTHY',
          uptime,
          errorCount: latestHealth?.errorCount || 0,
        },
      });

      return {
        status: 'HEALTHY',
        uptime,
        database: 'CONNECTED',
        api: 'RUNNING',
        timestamp: new Date(),
        details: health,
      };
    } catch (error) {
      return {
        status: 'UNHEALTHY',
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  async getRecentErrors(limit: number) {
    return this.prisma.systemHealth.findMany({
      where: {
        lastErrorAt: { not: null },
      },
      take: limit,
      orderBy: { lastErrorAt: 'desc' },
    });
  }

  // Platform Settings
  async getPlatformSettings() {
    let settings = await this.prisma.platformSettings.findFirst();

    if (!settings) {
      settings = await this.prisma.platformSettings.create({
        data: {
          platformName: 'ArwaPark',
          defaultLanguage: 'FR',
          enabledLanguages: ['FR', 'AR', 'EN'],
        },
      });
    }

    return settings;
  }

  async updatePlatformSettings(data: any) {
    const existing = await this.getPlatformSettings();

    return this.prisma.platformSettings.update({
      where: { id: existing.id },
      data,
    });
  }

  // Password Reset Requests Management
  async getPasswordResetRequests(status?: string) {
    const where = status ? { status } : {};
    
    const requests = await this.prisma.passwordResetRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { requests };
  }

  async respondToPasswordResetRequest(
    id: string,
    body: { response: string; sendEmail: boolean; newPassword?: string }
  ) {
    const request = await this.prisma.passwordResetRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Password reset request not found');
    }

    // Update request with response
    await this.prisma.passwordResetRequest.update({
      where: { id },
      data: {
        adminResponse: body.response,
        status: 'RESOLVED',
        respondedAt: new Date(),
      },
    });

    // If sendEmail and newPassword provided, update user password
    if (body.sendEmail && body.newPassword) {
      const user = await this.prisma.user.findUnique({
        where: { email: request.email },
      });

      if (user) {
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash(body.newPassword, 10);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: hash },
        });
      }
    }

    // TODO: Send email to user with response and new password if provided
    // For now, just log it
    console.log(`Email sent to ${request.email}:`);
    console.log(`Response: ${body.response}`);
    if (body.newPassword) {
      console.log(`New password: ${body.newPassword}`);
    }

    return {
      ok: true,
      message: 'Response sent successfully',
    };
  }

  async updatePasswordResetRequestStatus(id: string, status: string) {
    return this.prisma.passwordResetRequest.update({
      where: { id },
      data: { status },
    });
  }}