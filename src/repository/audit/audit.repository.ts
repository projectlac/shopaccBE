import { Audit } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Audit)
export class AuditRepository extends Repository<Audit> {}
