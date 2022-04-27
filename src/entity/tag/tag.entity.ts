import { Entity, ManyToMany, Column } from 'typeorm';
import { BaseColumn } from '../base';
import { Post } from '../post';

@Entity()
export class Tag extends BaseColumn {
  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
