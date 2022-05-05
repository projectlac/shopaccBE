import { BaseQuery } from '@/core';
import { ApiProperty } from '@nestjs/swagger';

export class QueryPostDto extends BaseQuery {}

export class QueryPostTagDto extends QueryPostDto {
  @ApiProperty()
  tag: string;
}
