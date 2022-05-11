import { Module } from '@nestjs/common';
import { HistoryService } from './service';

const providers = [HistoryService];

@Module({
  providers,
  exports: providers,
})
export class HistoryModule {}
