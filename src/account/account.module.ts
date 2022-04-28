import { DriverModule } from '@/driver';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { AccountController, AccountGetController } from './controller';
import { AccountService } from './service';

@Module({
  imports: [DriverModule, RepositoryModule],
  controllers: [AccountController, AccountGetController],
  providers: [AccountService],
})
export class AccountModule {}
