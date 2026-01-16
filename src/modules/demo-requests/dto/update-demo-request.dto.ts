import { IsString, IsIn, IsOptional } from 'class-validator'

export class UpdateDemoRequestDto {
  @IsString()
  @IsOptional()
  @IsIn(['NEW', 'CONTACTED', 'CONVERTED', 'REJECTED'])
  status?: string
}
