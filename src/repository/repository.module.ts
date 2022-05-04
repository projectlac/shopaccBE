import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Cloundinary, Driver, Post, Tag, User } from '@/entity';
import { Module } from '@nestjs/common';
import { DriverRepository } from './driver';
import { UserRepository } from './user';
import { PostRepository } from './post';
import { TagRepository } from './tag';
import { AccountRepository } from './account';
import { CloundinaryReposiotry } from './cloudinary';

const ENTITY_LIST = [User, Driver, Post, Tag, Account, Cloundinary];
const REPOSITORY_LIST = [
  UserRepository,
  DriverRepository,
  PostRepository,
  TagRepository,
  AccountRepository,
  CloundinaryReposiotry,
];

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITY_LIST, ...REPOSITORY_LIST])],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
