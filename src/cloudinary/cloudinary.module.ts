import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { CloundinaryController } from './controller';
import { CloundinaryService } from './service';
export const providers = [CloundinaryService];
@Module({
  imports: [RepositoryModule],
  controllers: [CloundinaryController],
  providers: [...providers],
  exports: [...providers],
})
export class CloudinaryModule {}
