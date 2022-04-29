import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryPostDto, QueryPostTagDto } from '../dto';
import { PostService } from '../service';

@Controller('post-get')
@ApiTags('post-get')
export class PostGetController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPost(@Query() queryPost: QueryPostDto) {
    return this.postService.getAll(queryPost);
  }

  @Get('tags')
  async getAllPostByTag(@Query() queryPostByTag: QueryPostTagDto) {
    return this.postService.getAllByTag(queryPostByTag);
  }
}
