import { ApiProperty } from '@nestjs/swagger';

export class BaseQuery {
  @ApiProperty()
  limit?: number;
  @ApiProperty()
  offset?: number;
}
