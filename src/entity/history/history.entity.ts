import { Column, Entity } from 'typeorm';
import { BaseColumn } from '../base';
export const HISTORY_TABLE_NAME = 'history';

export enum HISTORY_TYPE {
  AMOUNT_TRANSERRED = 'AMOUNT_TRANSERRED',
  CREATE_AUDIT = 'CREATE_AUDIT',
  CHANGE_STATUS_AUDIT = 'CHANGE_STATUS_AUDIT',
}

@Entity(HISTORY_TABLE_NAME)
export class History extends BaseColumn {
  @Column({ enum: HISTORY_TYPE })
  type: HISTORY_TYPE;
}
