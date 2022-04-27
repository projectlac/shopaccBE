import { DriverModule } from '@/driver';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { PostController } from './controller';
import { PostService } from './service';

@Module({
  imports: [RepositoryModule, DriverModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
