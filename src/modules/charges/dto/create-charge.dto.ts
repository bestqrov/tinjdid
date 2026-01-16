import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator'

export class CreateChargeDto {
  @IsOptional()
  @IsString()
  tripId?: string

  @IsString()
  type: string

  @IsNumber()
  amount: number

  @IsString()
  currency: string

  @IsOptional()
  @IsString()
  description?: string
}
