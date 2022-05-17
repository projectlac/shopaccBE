import { Account, Audit, History, Post, User } from '@/entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseQuery {
  @ApiProperty()
  limit?: number;
  @ApiProperty()
  offset?: number;
}

export class BaseQueryResponse<T> {
  data: T[];
  total: number;
}
