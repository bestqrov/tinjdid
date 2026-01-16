import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTripDto {
  @IsDateString()
  date: string

  @IsString()
  pickup: string

  @IsString()
  dropoff: string

  @IsString()
  tripType: string

  @IsOptional()
  @IsString()
  vehicleId?: string

  @IsOptional()
  @IsString()
  driverId?: string

  @IsNumber()
  price: number

  @IsOptional()
  @IsString()
  status?: string
}
