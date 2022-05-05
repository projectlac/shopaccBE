import { BaseQuery } from '@/core';
import { ApiProperty } from '@nestjs/swagger';
export class QueryAccountDto extends BaseQuery {
  @ApiProperty()
  weapon?: string;
}
