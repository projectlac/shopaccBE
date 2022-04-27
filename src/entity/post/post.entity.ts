import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
}

@Entity()
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

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
  tags: Tag[];
}
