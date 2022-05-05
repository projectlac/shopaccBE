import { MailerService } from '@/mailer';
import {
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { AppService } from './app.service';
import { CloundinaryService } from '@/cloudinary';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailerService: MailerService,
    private cloundinaryService: CloundinaryService,
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
        filename: (_req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // return this.driverService.uploadFile(file);
    return this.cloundinaryService.uploadFile(file);
  }

  @Delete(':publicId')
  deleteFile(@Param('publicId') publicId: string) {
    return this.cloundinaryService.deleteFile(publicId);
  }

  @Post('send-mail')
  sendMail() {
    // return this.mailerService.sendWelcomeMail(
    //   'lhongquan.1998@gmail.com',
    //   'Quill',
    // );
    return this.mailerService.sendResetPasswordMail(
      'lhongquan.1998@gmail.com',
      'ASDASDASDAS',
      'username',
    );
  }
}
