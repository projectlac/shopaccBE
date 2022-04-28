import { JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { USER_ROLE } from '@/entity';
import { Body } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto';
import { TagService } from './tag.service';
@Controller('tag')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(USER_ROLE.ADMIN,USER_ROLE.MOD)
export class TagController{
constructor(private tagService: TagService){}

@Post('create')
async createTag(@Body() createTagDto:CreateTagDto){
    return this.tagService.createTag(createTagDto)
}

@Patch('update/:id')
async updateTag(@Param('id') id :string, @Body() updateTagDto: UpdateTagDto){
    return this.tagService.updateTag(id,updateTagDto)
}

@Get()
async getAllTag(){
    return this.tagService.getAll();
}

}