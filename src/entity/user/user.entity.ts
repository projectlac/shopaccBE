import { Entity, Column } from 'typeorm';
import { BaseColumn } from '../base';

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

export type UserWithOutPassword = Omit<User, 'password'>;

@Entity()
export class User extends BaseColumn {
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: USER_ROLE, default: USER_ROLE.USER })
  role: USER_ROLE;

  @Column({ default: false })
  confirmedEmail: boolean;
}
