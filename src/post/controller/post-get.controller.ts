import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Param } from '@nestjs/common';
import { QueryPostDto, QueryPostTagDto } from '../dto';
import { PostService } from '../service';
import { UseInterceptors } from '@nestjs/common';
import { GetAllPostInterceptor } from '../interceptor';

@Controller('post-get')
@ApiTags('post-get')
export class PostGetController {
  constructor(private postService: PostService) {}

  @Get()
  @UseInterceptors(GetAllPostInterceptor)
  async getAllPost(@Query() queryPost: QueryPostDto) {
    return this.postService.getAll(queryPost);
  }

  @ApiParam({
    name: 'id',
  })
  @Get('details/:id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get('tags')
  async getAllPostByTag(@Query() queryPostByTag: QueryPostTagDto) {
    return this.postService.getAllByTag(queryPostByTag);
  }
}
