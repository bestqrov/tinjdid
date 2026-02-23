export class CreateContractDto {
  collaboratorId?: string
  number?: string
  contractTypeId?: string
  startDate?: string
  hireDate?: string
  endDatePlanned?: string
  durationPlanned?: number
  endDateReal?: string
  durationReal?: number
  probationPeriod?: number
  hours?: number
  comment?: string
}
