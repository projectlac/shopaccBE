import { JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { USER_ROLE } from '@/entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto';
import { TagService } from './tag.service';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('tag')
@ApiTags('tag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(USER_ROLE.ADMIN, USER_ROLE.MOD)
export class TagController {
  constructor(private tagService: TagService) {}

  @Post('create')
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @ApiParam({ name: 'id' })
  @Patch('update/:id')
  async updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Get()
  async getAllTag() {
    return this.tagService.getAll();
  }
}
