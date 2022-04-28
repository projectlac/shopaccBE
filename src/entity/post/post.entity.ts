import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseColumn } from '../base';
import { Driver } from '../driver';
import { Tag } from '../tag';
import { User } from '../user';

export enum POST_RELATION {
  IMAGE = 'image',
  USER = 'user',
  TAG = 'tags',
  POST_TAGS_TAG = 'post_tags_tag',
}

export const POST_TABLE_NAME = 'post';

@Entity('post')
export class Post extends BaseColumn {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @OneToOne(() => Driver, { nullable: true })
  @JoinColumn()
  image: Driver;

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable({ name: POST_RELATION.POST_TAGS_TAG })
  tags: Tag[];
}
