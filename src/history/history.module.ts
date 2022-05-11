import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { HistoryService } from './service';

const providers = [HistoryService];

@Module({
  imports: [RepositoryModule],
  providers,
  exports: providers,
})
export class HistoryModule {}
