import { ApiProperty } from '@nestjs/swagger';

export class QueryTagDto {
  @ApiProperty()
  type: string;
}
