import { JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTagDto, QueryTagDto, UpdateTagDto } from './dto';
import { TagService } from './tag.service';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MOD_ADMIN_ROLE } from '@/core';
import { Query } from '@nestjs/common';

@Controller('tag')
@ApiTags('tag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...MOD_ADMIN_ROLE)
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
  async getAllTag(@Query() queryTag: QueryTagDto) {
    return this.tagService.getAll(queryTag);
  }
}
