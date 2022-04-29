import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { User, USER_ROLE } from '@/entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { PostService } from '../service';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('post')
@ApiTags('post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MOD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
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
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MOD)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiParam({ name: 'id' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.updatePost(id, updatePostDto, file);
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id' })
  @Roles(USER_ROLE.ADMIN)
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
