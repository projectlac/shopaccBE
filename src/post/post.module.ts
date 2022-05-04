import { CloudinaryModule } from '@/cloudinary';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { PostController, PostGetController } from './controller';
import { PostService } from './service';

@Module({
  imports: [RepositoryModule, CloudinaryModule],
  providers: [PostService],
  controllers: [PostController, PostGetController],
})
export class PostModule {}
