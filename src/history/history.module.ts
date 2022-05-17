import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { HistoryController } from './controller';
import { HistoryService } from './service';

const providers = [HistoryService];

@Module({
  controllers: [HistoryController],
  imports: [RepositoryModule],
  providers,
  exports: providers,
})
export class HistoryModule {}
