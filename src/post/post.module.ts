import { CloudinaryModule } from '@/cloudinary';
import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { PostController, PostGetController } from './controller';
import { GetAllPostInterceptor } from './interceptor';
import { PostService } from './service';

@Module({
  imports: [RepositoryModule, CloudinaryModule],
  providers: [PostService, GetAllPostInterceptor],
  controllers: [PostController, PostGetController],
})
export class PostModule {}
