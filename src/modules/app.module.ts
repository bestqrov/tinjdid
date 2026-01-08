import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { CompaniesModule } from './companies/companies.module'
import { VehiclesModule } from './vehicles/vehicles.module'
import { DriversModule } from './drivers/drivers.module'
import { TripsModule } from './trips/trips.module'
import { QuotesModule } from './quotes/quotes.module'
import { InvoicesModule } from './invoices/invoices.module'
import { ChargesModule } from './charges/charges.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { FinanceModule } from './finance/finance.module'
import { ContractsModule } from './contracts/contracts.module'
import { ConsommationModule } from './consommation/consommation.module'
import { SettingsModule } from './settings/settings.module'
import { CartesModule } from './cartes/cartes.module'
import { SuperAdminModule } from './super-admin/super-admin.module'
import { DemoRequestsModule } from './demo-requests/demo-requests.module'
import { PrismaModule } from '../prisma/prisma.module'
import { PrismaService } from '../prisma/prisma.service'
import { AllExceptionsFilter } from '../common/filters/http-exception.filter'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CompaniesModule,
    VehiclesModule,
    DriversModule,
    TripsModule,
    QuotesModule,
    InvoicesModule,
    ChargesModule,
    DashboardModule,
    FinanceModule,
    ContractsModule,
    ConsommationModule,
    SettingsModule,
    CartesModule,
    SuperAdminModule,
    DemoRequestsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, { provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
