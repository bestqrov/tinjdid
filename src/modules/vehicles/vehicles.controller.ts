import { Body, Controller, Delete, Get, Param, Post, Query, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { VehiclesService } from './vehicles.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'

@Controller('vehicles')
export class VehiclesController {
  constructor(private svc: VehiclesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photoPrincipale', {
    storage: diskStorage({
      destination: './uploads/vehicles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `vehicle-${uniqueSuffix}${extname(file.originalname)}`)
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false)
      }
      cb(null, true)
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  }))
  create(
    @Query('companyId') companyId: string, 
    @Body() body: CreateVehicleDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      body.photoPrincipale = file.filename
    }
    return this.svc.create(companyId, body)
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.svc.findAll(companyId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
