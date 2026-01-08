import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CreateContractDto } from './dto/create-contract.dto'

@Controller('contracts')
export class ContractsController {
  constructor(private svc: ContractsService) {}

  @Get('metadata')
  metadata(@Query('companyId') companyId: string) {
    return this.svc.findMetadata(companyId)
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.svc.findAll(companyId)
  }

  @Post()
  @UseInterceptors(FileInterceptor('attachment', {
    storage: diskStorage({
      destination: './uploads/contracts',
      filename: (_req, file, cb) => {
        const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8)
        cb(null, name + extname(file.originalname))
      }
    })
  }))
  async create(@Query('companyId') companyId: string, @Body() body: CreateContractDto, @UploadedFile() file: any) {
    const path = file ? file.path.replace(/\\/g, '/') : undefined
    return this.svc.create(companyId, body, path)
  }
}
