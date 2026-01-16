import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateQuoteDto {
  @IsOptional()
  @IsString()
  tripId?: string

  @IsNumber()
  amount: number

  @IsString()
  currency: string

  @IsOptional()
  @IsString()
  status?: string
}
