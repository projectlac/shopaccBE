import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseColumn } from '../base';
import { User } from '../user';

export const AUDIT_TABLE_NAME = 'audit';

@Entity(AUDIT_TABLE_NAME)
export class Audit extends BaseColumn {
  @ManyToOne(() => User, (user) => user.audits)
  user: User;

  @Column({ type: 'text' })
  auditInformation: string;
}
