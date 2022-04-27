import { Column, Entity } from 'typeorm';
import { BaseColumn } from '../base';


@Entity()
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
