import { IsString, IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator'

export class CreateDemoRequestDto {
  @IsString()
  @IsNotEmpty()
  companyName: string

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  fleetSize: string

  @IsString()
  @IsNotEmpty()
  @IsIn(['STARTER', 'PRO', 'ENTERPRISE'])
  interestedPlan: string

  @IsString()
  @IsOptional()
  message?: string
}
