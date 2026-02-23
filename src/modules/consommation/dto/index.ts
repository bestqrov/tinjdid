import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateCarburantDto {
  @IsString()
  vehicle: string;

  @IsString()
  @IsOptional()
  collaborator?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  station?: string;

  @IsString()
  @IsOptional()
  paymentMode?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  amountHT?: number;

  @IsNumber()
  @IsOptional()
  tva?: number;

  @IsNumber()
  @IsOptional()
  amountTTC?: number;

  @IsBoolean()
  @IsOptional()
  plein?: boolean;

  @IsNumber()
  @IsOptional()
  kilometrage?: number;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  @IsOptional()
  percentConso?: number;

  @IsNumber()
  @IsOptional()
  indexHoraire?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateAutoRouteDto {
  @IsString()
  vehicle: string;

  @IsString()
  @IsOptional()
  collaborator?: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsOptional()
  entryGate?: string;

  @IsString()
  @IsOptional()
  exitGate?: string;

  @IsString()
  @IsOptional()
  paymentMode?: string;

  @IsNumber()
  @IsOptional()
  amountTTC?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateDepenseDto {
  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  tva?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateServiceDto {
  @IsString()
  @IsOptional()
  vehicle?: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateFraisGenerauxDto {
  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateRechargeCarteDto {
  @IsString()
  card: string;

  @IsString()
  date: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
