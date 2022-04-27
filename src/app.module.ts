import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database';
import { MailerModule } from '@/mailer';
import { DriverModule } from '@/driver';
import { RepositoryModule } from '@/repository';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [DatabaseModule, MailerModule, DriverModule, RepositoryModule, AuthModule, PostModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
