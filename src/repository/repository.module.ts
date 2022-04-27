import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver, Post, Tag, User } from '@/entity';
import { Module } from '@nestjs/common';
import { DriverRepository } from './driver';
import { UserRepository } from './user';
import { PostRepository } from './post';
import { TagRepository } from './tag';

const ENTITY_LIST = [User, Driver, Post, Tag];
const REPOSITORY_LIST = [
  UserRepository,
  DriverRepository,
  PostRepository,
  TagRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITY_LIST, ...REPOSITORY_LIST])],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
