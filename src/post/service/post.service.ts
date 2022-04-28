import { POST_CONFIG, POST_MESSAGE } from '@/core';
import { DriverService } from '@/driver';
import {
  Driver,
  Post,
  POST_RELATION,
  POST_TABLE_NAME,
  TAG_RELATION,
  User,
} from '@/entity';
import { DriverRepository, PostRepository, TagRepository } from '@/repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Any, Connection, In } from 'typeorm';
import {
  CreatePostDto,
  QueryPostDto,
  QueryPostTagDto,
  UpdatePostDto,
} from '../dto';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private driverService: DriverService,
    private driverRepository: DriverRepository,
    private tagRepository: TagRepository,
  ) {}

  async createNewPost(
    createPostDto: CreatePostDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Post> {
    const { title, content, tags } = createPostDto;
    const image = file ? await this.driverService.uploadFile(file) : null;
    const listTag =
      tags && tags.length > 0
        ? await this.tagRepository.find({
            where: {
              title: In(tags.split(',')),
            },
          })
        : [];
    const newPost = this.postRepository.create({
      title,
      content,
      user,
      tags: listTag,
      image,
    });
    return this.postRepository.save(newPost);
  }

  async deletePost(id: string) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
        relations: [POST_RELATION.IMAGE],
      });
      if (!post)
        throw new HttpException(POST_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
      return Promise.all([
        this.postRepository.delete(id),
        this.driverRepository.delete(post.image.id),
        this.driverService.deleteFile(post.image.driverId),
      ]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
  ) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: [POST_RELATION.IMAGE],
      });
      if (!post)
        throw new HttpException(POST_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
      if (file) {
        const image = await this.driverService.uploadFile(file);
        const { id: imageId, driverId } = post.image;
        return Promise.all([
          this.postRepository.save({
            ...post,
            image,
            ...updatePostDto,
          }),
          this.driverRepository.delete(imageId),
          this.driverService.deleteFile(driverId),
        ]);
      }
      return this.postRepository.update({ id }, { ...updatePostDto });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAll(queryPost: QueryPostDto): Promise<Post[]> {
    try {
      const { offset = 0, limit = POST_CONFIG.LIMIT } = queryPost;
      return this.postRepository.find({
        skip: offset,
        take: limit,
        relations:[POST_RELATION.TAG]
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllByTag(queryPostTag: QueryPostTagDto): Promise<Post[]> {
    try {
      const { offset = 0, limit = POST_CONFIG.LIMIT, tag } = queryPostTag;
      const tags = await this.tagRepository.find({
        where: {
          title: In(tag.split(',')),
        },
      });
      return this.postRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.tags', 'tag')
        .where('tag.id In(:...tagIds)', { tagIds: tags.map(({ id }) => id) })
        .offset(offset)
        .limit(limit)
        .getMany();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
