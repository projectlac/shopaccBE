import { CloudinaryModule } from '@/cloudinary';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { AccountController, AccountGetController } from './controller';
import { AccountService } from './service';

@Module({
  imports: [RepositoryModule, CloudinaryModule],
  controllers: [AccountController, AccountGetController],
  providers: [AccountService],
})
export class AccountModule {}
