import { AuditInformationDto } from '@/audit';
import { AuditInformation } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AuditInformation)
export class AuditInformationRepository extends Repository<AuditInformation> {
  async createAuditInformations(
    auditInformations: AuditInformationDto[],
  ): Promise<AuditInformation[]> {
    const rawAuditInformations = this.create(auditInformations);
    return this.save(rawAuditInformations);
  }
}
