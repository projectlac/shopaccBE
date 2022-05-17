import { CloudinaryModule } from '@/cloudinary';
import { HistoryModule } from '@/history';
import { MailerModule } from '@/mailer';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { AccountController, AccountGetController } from './controller';
import { GetAccountInterceptor } from './interceptor';
import { AccountService } from './service';

@Module({
  imports: [RepositoryModule, CloudinaryModule, HistoryModule, MailerModule],
  controllers: [AccountController, AccountGetController],
  providers: [AccountService, GetAccountInterceptor],
})
export class AccountModule {}
