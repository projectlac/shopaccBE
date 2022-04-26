import { MULTER_CONFIG } from '@/core';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { DriverService } from '@/driver';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { MailerService } from '@/mailer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private driverService: DriverService,
    private mailerService: MailerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.driverService.uploadFile(file);
  }

  @Post('send-mail')
  sendMail() {
    return this.mailerService.sendWelcomeMail(
      'lhongquan.1998@gmail.com',
      'Quill',
    );
  }
}
