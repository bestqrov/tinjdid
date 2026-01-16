import { IsEnum, IsInt, IsOptional, IsString, Min, IsNumber, IsDateString } from 'class-validator'

export class CreateVehicleDto {
  @IsString()
  immatricule: string

  @IsOptional()
  @IsString()
  typeAcquisition?: string

  @IsOptional()
  @IsString()
  nom?: string

  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsDateString()
  dateMiseEnCirculation?: string

  @IsOptional()
  @IsString()
  centreCout?: string

  @IsOptional()
  @IsString()
  numeroOrdre?: string

  @IsOptional()
  @IsString()
  carteGrise?: string

  @IsOptional()
  @IsString()
  numeroChassis?: string

  @IsOptional()
  @IsString()
  numeroW?: string

  @IsOptional()
  @IsString()
  couleur?: string

  @IsOptional()
  @IsString()
  codeCle?: string

  @IsOptional()
  @IsDateString()
  datePrevueRestitution?: string

  @IsOptional()
  @IsNumber()
  kilometrageInitial?: number

  @IsOptional()
  @IsNumber()
  indiceHoraireInitial?: number

  @IsOptional()
  @IsString()
  commentaire?: string

  @IsOptional()
  @IsString()
  modele?: string

  @IsOptional()
  @IsString()
  concessionnaire?: string

  @IsOptional()
  @IsDateString()
  dateAchat?: string

  @IsOptional()
  @IsString()
  numeroContrat?: string

  @IsOptional()
  @IsString()
  garantie?: string

  @IsOptional()
  @IsNumber()
  montantHT?: number

  @IsOptional()
  @IsNumber()
  tva?: number

  @IsOptional()
  @IsString()
  photoPrincipale?: string
}

