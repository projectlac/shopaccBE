import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { User, UserWithOutPassword, USER_ROLE } from '@/entity';
import { Body, ParseIntPipe, Patch, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dto';
import { PostService } from '../service';
import { v4 as uuid } from 'uuid';
import { UseGuards } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('post')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  @Roles(USER_ROLE.ADMIN,USER_ROLE.MOD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createNewPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createNewPost(createPostDto, currentUser, file);
  }

  @Patch('update/:id')
  @Roles(USER_ROLE.ADMIN,USER_ROLE.MOD)
  async updatePost(@Param('id') id:string, @Body() updatePostDto: UpdatePostDto){
      return this.postService.updatePost(id,updatePostDto)
  }

  @Delete('delete/:id')
  @Roles(USER_ROLE.ADMIN)
  async deletePost(@Param('id') id:string){
      return this.postService.deletePost(id)
  }

  @Get()
  async getAllPost(@Query() queryPost:QueryPostDto){
      return this.postService.getAll(queryPost)
  }
}
