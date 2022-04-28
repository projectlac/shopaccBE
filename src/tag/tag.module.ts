import { RepositoryModule } from '@/repository';
import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
    imports:[RepositoryModule],
    controllers:[TagController],
    providers:[TagService]
})
export class TagModule {}
