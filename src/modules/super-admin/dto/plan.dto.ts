import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum PlanType {
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @IsNumber()
  @IsOptional()
  maxVehicles?: number;

  @IsNumber()
  @IsOptional()
  maxTrips?: number;

  @IsNumber()
  priceMonthly: number;

  @IsNumber()
  priceYearly: number;

  @IsOptional()
  features?: any;

  @IsArray()
  @IsOptional()
  modulesEnabled?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @IsNumber()
  @IsOptional()
  maxVehicles?: number;

  @IsNumber()
  @IsOptional()
  maxTrips?: number;

  @IsNumber()
  @IsOptional()
  priceMonthly?: number;

  @IsNumber()
  @IsOptional()
  priceYearly?: number;

  @IsOptional()
  features?: any;

  @IsArray()
  @IsOptional()
  modulesEnabled?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
