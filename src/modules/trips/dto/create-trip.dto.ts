import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { TripType, TripStatus } from '@prisma/client'

export class CreateTripDto {
  @IsDateString()
  date: string

  @IsString()
  pickup: string

  @IsString()
  dropoff: string

  @IsEnum(TripType)
  tripType: TripType

  @IsOptional()
  @IsString()
  vehicleId?: string

  @IsOptional()
  @IsString()
  driverId?: string

  @IsNumber()
  price: number

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus
}
