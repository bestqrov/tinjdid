import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsArray, IsDateString } from 'class-validator'
import { InvoiceStatus, Currency } from '@prisma/client'

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  tripId?: string

  @IsOptional()
  @IsString()
  numero?: string

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  clientId?: string

  @IsNumber()
  amount: number

  @IsOptional()
  @IsNumber()
  tvaPercent?: number

  @IsEnum(Currency)
  currency: Currency

  @IsBoolean()
  tva: boolean

  @IsOptional()
  @IsString()
  numeroAttestation?: string

  @IsOptional()
  @IsDateString()
  dateDelivrance?: string

  @IsOptional()
  @IsString()
  periodeFacturation?: string

  @IsOptional()
  @IsString()
  pdfUrl?: string

  @IsOptional()
  @IsArray()
  lines?: any[]

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus
}
