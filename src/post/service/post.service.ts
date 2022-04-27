import { POST_CONFIG, POST_MESSAGE } from '@/core';
import { DriverService } from '@/driver';
import { Driver, Post, POST_RELATION, User } from '@/entity';
import { DriverRepository, PostRepository, TagRepository } from '@/repository';
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dto';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private driverService: DriverService,
    private driverRepository:DriverRepository,
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
              title: In([createPostDto.tags]),
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

  async deletePost(id:string){
      try {
        const post = await this.postRepository.findOne({
            where:{
                id
            },
            relations:[POST_RELATION.IMAGE]
        })
        return Promise.all([this.postRepository.delete(id),this.driverRepository.delete(post.image.id),this.driverService.deleteFile(post.image.driverId)])
        // return POST_MESSAGE.DELETE
      } catch (error) {
          console.log(error)
          throw error
      }
  }

  async updatePost(id:string, updatePostDto:UpdatePostDto){
      try {
          return this.postRepository.update({id},{...updatePostDto})
      } catch (error) {
          console.log(error)
          throw error
      }
  }

  async getAll(queryPost:QueryPostDto):Promise<Post[]>{
      try {
          const { offset=0,limit=POST_CONFIG.LIMIT} = queryPost
          return this.postRepository.find({
            skip:offset,
            take:limit
          })
      } catch (error) {
        console.log(error)
        throw error
      }
  }
}
