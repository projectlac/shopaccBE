import { BaseQuery } from '@/core';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPostDto extends BaseQuery {
  @ApiProperty()
  slug?: string;
}

export class QueryPostTagDto extends QueryPostDto {
  @ApiProperty()
  tag?: string;
}
