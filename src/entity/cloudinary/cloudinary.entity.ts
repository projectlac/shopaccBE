import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseColumn } from '../base';

export const CLOUNDINARY_TABLE_NAME = 'cloundinary';

@Entity(CLOUNDINARY_TABLE_NAME)
export class Cloundinary {
  @PrimaryColumn()
  public_id: string;
  @Column()
  asset_id: string;
  @Column()
  version: number;
  @Column()
  version_id: string;
  @Column()
  signature: string;
  @Column()
  width: number;
  @Column()
  height: number;
  @Column()
  format: string;
  @Column()
  resource_type: string;
  @Column()
  created_at: Date;
  @Column()
  bytes: number;
  @Column()
  type: string;
  @Column()
  etag: string;
  @Column({ type: 'text', default: '' })
  url: string;
  @Column({ type: 'text', default: '' })
  secure_url: string;
  @Column()
  original_filename: string;
  @Column()
  original_extension: string;
  @Column()
  api_key: string;
  @Column({ default: false, nullable: true })
  isBanner: boolean;
  @Column({ default: 0, nullable: true })
  order: number;
}
