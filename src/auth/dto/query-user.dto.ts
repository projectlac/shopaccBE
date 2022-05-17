import { BaseQuery } from '@/core';
import { USER_ROLE } from '@/entity';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto extends BaseQuery {
  @ApiProperty()
  role?: USER_ROLE;
  @ApiProperty()
  username?: string;
}
