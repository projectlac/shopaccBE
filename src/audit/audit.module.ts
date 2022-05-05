import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { AuditController } from './controller';
import { AuditService } from './service';

@Module({
  imports: [RepositoryModule],
  providers: [AuditService],
  controllers: [AuditController],
})
export class AuditModule {}
