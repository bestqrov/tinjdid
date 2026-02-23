import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export class UpdateCompanyStatusDto {
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class AssignPlanDto {
  @IsString()
  planId: string;
}
