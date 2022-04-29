import { ApiProperty } from '@nestjs/swagger';

export class QueryPostDto {
  @ApiProperty()
  offset?: number;
  @ApiProperty()
  limit?: number;
}

export class QueryPostTagDto extends QueryPostDto {
  @ApiProperty()
  tag: string;
}
