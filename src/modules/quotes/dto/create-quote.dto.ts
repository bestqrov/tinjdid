import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { QuoteStatus, Currency } from '@prisma/client'

export class CreateQuoteDto {
  @IsOptional()
  @IsString()
  tripId?: string

  @IsNumber()
  amount: number

  @IsEnum(Currency)
  currency: Currency

  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus
}
