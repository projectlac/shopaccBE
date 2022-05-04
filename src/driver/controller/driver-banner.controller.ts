import {
  Post,
  UploadedFiles,
  UseInterceptors,
  Controller,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DriverService } from '../service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { UseGuards } from '@nestjs/common';
import { MOD_ADMIN_ROLE } from '@/core';
import { Get } from '@nestjs/common';
@Controller('driver-banner')
export class DriverBannerController {
  constructor(private driverService: DriverService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MOD_ADMIN_ROLE)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.driverService.uploadMultiFiles(files);
  }

  @Get()
  async getBannerUrl() {
    return this.driverService.getBannerDriver();
  }
}
