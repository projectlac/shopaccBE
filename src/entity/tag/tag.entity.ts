import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Account } from '../account';
import { BaseColumn } from '../base';

export enum TAG_TYPE {
  WEAPON = 'WEAPON',
  SERVER = 'SERVER',
  CHARACTER = 'CHARACTER',
}

export enum TAG_RELATION {
  POST = 'posts',
}

export const TAG_TABLE_NAME = 'tag';
@Entity(TAG_TABLE_NAME)
export class Tag extends BaseColumn {
  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ type: 'text' })
  information: string;

  @Column({ enum: TAG_TYPE, default: TAG_TYPE.WEAPON })
  type: TAG_TYPE;

  @ManyToMany(() => Account, (account) => account.tags, { cascade: true })
  @JoinTable()
  accounts: Account[];
}
