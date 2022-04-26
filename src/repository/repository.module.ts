import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver, User } from '@/entity';
import { Module } from '@nestjs/common';
import { DriverRepository } from './driver';
import { UserRepository } from './user';

const ENTITY_LIST = [User, Driver];
const REPOSITORY_LIST = [UserRepository, DriverRepository];

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITY_LIST, ...REPOSITORY_LIST])],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
