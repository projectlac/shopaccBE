import { Driver } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Driver)
export class DriverRepository extends Repository<Driver> {}
