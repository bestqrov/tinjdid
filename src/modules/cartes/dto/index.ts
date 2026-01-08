import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateCarteDto {
  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  holder?: string;

  @IsString()
  @IsOptional()
  vehicle?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsEnum(['active', 'inactive', 'blocked'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  expirationDate?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateCarteDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  holder?: string;

  @IsString()
  @IsOptional()
  vehicle?: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsEnum(['active', 'inactive', 'blocked'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  expirationDate?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
