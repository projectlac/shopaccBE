import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { Audit } from '../audit';
import { BaseColumn } from '../base';

export const AUDIT_INFORMATION_TABLE_NAME = 'auditInformation';

@Entity(AUDIT_INFORMATION_TABLE_NAME)
export class AuditInformation extends BaseColumn {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  unitPrice: number;

  @Column({ nullable: true })
  total: number;

  @ManyToOne(() => Audit, (audit) => audit.auditInformations)
  audit: Audit;

  @BeforeInsert()
  calculateTotal() {
    this.total = this.quantity * this.unitPrice;
  }
}
