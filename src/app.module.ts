import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database';
import { MailerModule } from '@/mailer';
import { DriverModule } from '@/driver';
import { RepositoryModule } from '@/repository';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, MailerModule, DriverModule, RepositoryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
