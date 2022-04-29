import { ApiProperty } from '@nestjs/swagger';
export class QueryAccountDto {
  @ApiProperty()
  weapon?: string;
  @ApiProperty()
  offset?: number;
  @ApiProperty()
  limit?: number;
}
