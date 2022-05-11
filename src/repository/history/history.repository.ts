import { History } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {}
