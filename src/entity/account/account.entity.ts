import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseColumn } from '../base';
import { Driver } from '../driver';
import { User } from '../user';

export const ACCOUNT_TABLE_NAME = 'account';

export enum ACCOUNT_RELATION {
  DRIVER = 'driver',
  USER = 'user',
}

@Entity(ACCOUNT_TABLE_NAME)
export class Account extends BaseColumn {
  @Column()
  @Generated('increment')
  order: number;

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

  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  @OneToOne(() => Driver, { nullable: true })
  @JoinColumn()
  driver: Driver;
}
