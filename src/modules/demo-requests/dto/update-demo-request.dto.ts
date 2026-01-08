import { IsString, IsIn, IsOptional } from 'class-validator'
import { DemoRequestStatus } from '@prisma/client'

export class UpdateDemoRequestDto {
  @IsString()
  @IsOptional()
  @IsIn(['NEW', 'CONTACTED', 'CONVERTED', 'REJECTED'])
  status?: DemoRequestStatus
}
