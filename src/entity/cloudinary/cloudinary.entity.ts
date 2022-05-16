import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from '../account';
import { BaseColumn } from '../base';

export const CLOUNDINARY_TABLE_NAME = 'cloundinary';

@Entity(CLOUNDINARY_TABLE_NAME)
export class Cloundinary {
  @PrimaryColumn()
  public_id: string;
  @Column({ nullable: true })
  asset_id: string;
  @Column({ nullable: true })
  version: number;
  @Column({ nullable: true })
  version_id: string;
  @Column({ nullable: true })
  signature: string;
  @Column({ nullable: true })
  width: number;
  @Column({ nullable: true })
  height: number;
  @Column({ nullable: true })
  format: string;
  @Column()
  resource_type: string;
  @Column({ nullable: true })
  created_at: Date;
  @Column({ nullable: true })
  bytes: number;
  @Column({ nullable: true })
  type: string;
  @Column({ nullable: true })
  etag: string;
  @Column({ type: 'text', default: '' })
  url: string;
  @Column({ type: 'text', default: '' })
  secure_url: string;
  @Column({ nullable: true })
  original_filename: string;
  @Column({ nullable: true })
  original_extension: string;
  @Column({ nullable: true })
  api_key: string;
  @Column({ default: false, nullable: true })
  isBanner: boolean;
  @Column({ default: 0, nullable: true })
  order: number;

  @ManyToOne(() => Account, (account) => account.cloundinary)
  account: Account;
}
