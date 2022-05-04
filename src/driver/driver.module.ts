import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { DriverBannerController } from './controller';
import { DriverService } from './service';

const providers = [DriverService];

@Module({
  controllers:[DriverBannerController],
  imports: [RepositoryModule],
  providers,
  exports: providers,
})
export class DriverModule {}
