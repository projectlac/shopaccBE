import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany } from 'typeorm';
import { Account } from '../account';
import { Audit } from '../audit';
import { BaseColumn } from '../base';
import { Post } from '../post';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

export interface PayloadTokenUser {
  username: string;
  id: string;
  role: USER_ROLE;
  email?: string;
}

export enum USER_RELATION {
  POSTS = 'posts',
  ACCOUNTS = 'accounts',
  AUDITS = 'audits',
}

export type UserWithOutPassword = Omit<User, 'password'>;

export const USER_TABLE_NAME = 'user';

@Entity('user')
export class User extends BaseColumn {
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ default: false })
  confirmedEmail: boolean;

  @Column({ default: false })
  isRecievePost: boolean;

  @OneToMany(() => Post, (post) => post.user, { nullable: true, cascade: true })
  posts: Post[];

  @OneToMany(() => Account, (account) => account.user, { nullable: true })
  accounts: Account[];

  @OneToMany(() => Audit, (audit) => audit.user, { nullable: true })
  audits: Audit[];

  @Column({ nullable: true })
  avatar: number;

  @Column({ nullable: true })
  money: number;

  @Column({ nullable: true })
  webMoney: number;
}
