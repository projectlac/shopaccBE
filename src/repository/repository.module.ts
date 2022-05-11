import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  Audit,
  AuditInformation,
  Cloundinary,
  Driver,
  History,
  Post,
  Tag,
  User,
} from '@/entity';
import { Module } from '@nestjs/common';
import { DriverRepository } from './driver';
import { UserRepository } from './user';
import { PostRepository } from './post';
import { TagRepository } from './tag';
import { AccountRepository } from './account';
import { CloundinaryReposiotry } from './cloudinary';
import { AuditRepository } from './audit';
import { AuditInformationRepository } from './audit-information';
import { HistoryRepository } from './history';

const ENTITY_LIST = [
  User,
  Driver,
  Post,
  Tag,
  Account,
  Cloundinary,
  Audit,
  AuditInformation,
  History,
];
const REPOSITORY_LIST = [
  UserRepository,
  DriverRepository,
  PostRepository,
  TagRepository,
  AccountRepository,
  CloundinaryReposiotry,
  AuditRepository,
  AuditInformationRepository,
  HistoryRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITY_LIST, ...REPOSITORY_LIST])],
  exports: [TypeOrmModule],
})
export class RepositoryModule {}
