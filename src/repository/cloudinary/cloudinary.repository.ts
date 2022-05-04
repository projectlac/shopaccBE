import { Cloundinary } from '@/entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Cloundinary)
export class CloundinaryReposiotry extends Repository<Cloundinary> {}
