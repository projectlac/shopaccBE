import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { DriverService } from './service';

const providers = [DriverService];

@Module({
  imports: [RepositoryModule],
  providers,
  exports: providers,
})
export class DriverModule {}
