import { Column, Entity } from 'typeorm';
import { BaseColumn } from '../base';

export const DRIVER_TABLE_NAME = 'driver';

@Entity(DRIVER_TABLE_NAME)
export class Driver extends BaseColumn {
  @Column()
  driverId: string;

  @Column({ type: 'text', default: '' })
  webContentLink: string;

  @Column({ type: 'text', default: '' })
  filename: string;

  @Column()
  mimeType: string;

  @Column()
  webViewLink: string;
}
