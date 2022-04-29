import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty()
  ar?: number;
  @ApiProperty()
  char?: string[];
  @ApiProperty()
  weapon?: string[];
}
