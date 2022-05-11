import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AuditInformation } from '../audit-information';
import { BaseColumn } from '../base';
import { User } from '../user';

export const AUDIT_TABLE_NAME = 'audit';

export enum AUDIT_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
export enum AUDIT_TYPE {
  COIN = 'COIN',
  STONE = 'STONE',
}

@Entity(AUDIT_TABLE_NAME)
export class Audit extends BaseColumn {
  @ManyToOne(() => User, (user) => user.audits, { nullable: true })
  user: User;

  @Column({ nullable: true })
  UID: string;

  @Column({ nullable: true })
  server: string;

  @Column({ nullable: true })
  total: number;

  @Column({ enum: AUDIT_STATUS, default: AUDIT_STATUS.PENDING })
  status: AUDIT_STATUS;

  @Column({ enum: AUDIT_TYPE, default: AUDIT_TYPE.STONE })
  type: AUDIT_TYPE;

  @OneToMany(() => AuditInformation, (aInf) => aInf.audit, {
    nullable: true,
    cascade: true,
  })
  auditInformations: AuditInformation[];
  @BeforeInsert()
  calculateTotal() {
    this.total = [...this.auditInformations].reduce(
      (totalAudit, { quantity, unitPrice }) =>
        quantity * unitPrice + totalAudit,
      0,
    );
  }
}
