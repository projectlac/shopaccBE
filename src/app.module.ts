import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database';
import { MailerModule } from '@/mailer';
import { RepositoryModule } from '@/repository';
import { AuthModule } from '@/auth';
import { AccountModule } from '@/account';
import { PostModule } from '@/post';
import { TagModule } from '@/tag';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from '@/cloudinary';
import { AuditModule } from '@/audit';

@Module({
  imports: [
    DatabaseModule,
    MailerModule,
    RepositoryModule,
    AuthModule,
    PostModule,
    TagModule,
    AccountModule,
    MulterModule,
    CloudinaryModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
