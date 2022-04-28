import { Column, Entity } from 'typeorm';
import { BaseColumn } from '../base';

export enum TAG_RELATION {
  POST = 'posts',
}

export const TAG_TABLE_NAME = 'tag';
@Entity(TAG_TABLE_NAME)
export class Tag extends BaseColumn {
  @Column({ unique: true })
  title: string;

  @Column()
  content: string;
}
