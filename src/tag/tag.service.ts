import { TAG_MESSAGE } from '@/core';
import { Tag } from '@/entity';
import { TagRepository } from '@/repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { CreateTagDto, QueryTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const { title } = createTagDto;
    const checkTag = await this.tagRepository.findOne({ title });
    if (checkTag)
      throw new HttpException(TAG_MESSAGE.CONFLICT, HttpStatus.CONFLICT);
    return this.tagRepository.save({ ...createTagDto });
  }

  async updateTag(
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<UpdateResult> {
    const { title } = updateTagDto;
    if (title) {
      const checkTag = await this.tagRepository.findOne({ title });
      if (checkTag)
        throw new HttpException(TAG_MESSAGE.CONFLICT, HttpStatus.CONFLICT);
    }
    return this.tagRepository.update({ id }, { ...updateTagDto });
  }

  async getAll(query: QueryTagDto): Promise<Tag[]> {
    const { type } = query;
    const where = type ? { type } : {};
    return this.tagRepository.find({
      where,
    });
  }
}
