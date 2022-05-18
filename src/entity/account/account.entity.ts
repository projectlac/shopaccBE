import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseColumn } from '../base';
import { Cloundinary } from '../cloudinary';
import { Driver } from '../driver';
import { Tag } from '../tag';
import { User } from '../user';

export const ACCOUNT_TABLE_NAME = 'account';

export enum ACCOUNT_RELATION {
  CLOUNDINARY = 'cloundinary',
  USER = 'user',
}

export enum ACCOUNT_STATUS {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

@Entity(ACCOUNT_TABLE_NAME)
export class Account extends BaseColumn {
  @Column()
  @Generated('increment')
  order: number;

  @Column({ default: 0 })
  oldPrice: number;

  @Column({ default: 0 })
  newPrice: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ enum: ACCOUNT_STATUS, default: ACCOUNT_STATUS.AVAILABLE })
  status: ACCOUNT_STATUS;

  @Column()
  ar: number;

  @Column({ nullable: true })
  soldAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Cloundinary, (cloudinary) => cloudinary.account)
  cloundinary: Cloundinary[];

  @Column({ nullable: true, type: 'text' })
  imageUrl: string;

  @ManyToMany(() => Tag, (tag) => tag.accounts)
  tags: Tag[];
}
