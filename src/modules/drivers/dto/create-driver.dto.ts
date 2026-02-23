import { IsString, IsOptional, IsBoolean, IsArray, IsEmail, IsDateString } from 'class-validator'

export class CreateDriverDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  photo?: string

  @IsOptional()
  @IsString()
  licenseNumber?: string

  @IsOptional()
  @IsDateString()
  licenseExpiry?: string

  @IsOptional()
  @IsString()
  emergencyContact?: string

  @IsOptional()
  @IsString()
  emergencyPhone?: string

  // Legacy fields for compatibility
  @IsOptional()
  @IsString()
  whatsapp?: string

  @IsOptional()
  @IsString()
  cinNumber?: string

  @IsOptional()
  @IsArray()
  languages?: string[]

  @IsOptional()
  @IsBoolean()
  available?: boolean

  @IsOptional()
  @IsString()
  driverPhoto?: string

  @IsOptional()
  @IsString()
  driverLicense?: string

  @IsOptional()
  @IsString()
  cin?: string

  @IsOptional()
  @IsString()
  cv?: string
}
