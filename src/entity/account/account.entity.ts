import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseColumn } from '../base';
import { Cloundinary } from '../cloudinary';
import { Driver } from '../driver';
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

  @Column({ type: 'text' })
  char: string;

  @Column({ type: 'text' })
  weapon: string;

  @Column()
  charCount: number;

  @Column()
  weaponCount: number;

  @Column({ nullable: true })
  soldAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToMany(() => Cloundinary, (cloudinary) => cloudinary.account)
  cloundinary: Cloundinary[];

  @Column({ nullable: true, type: 'text' })
  imageUrl: string;
}
