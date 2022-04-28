import { Account } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
