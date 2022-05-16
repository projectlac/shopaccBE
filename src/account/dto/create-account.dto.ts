import { ApiProperty } from '@nestjs/swagger';
export class CreateAccountDto {
  @ApiProperty()
  ar: number;
  @ApiProperty()
  char: string[];
  @ApiProperty()
  weapon: string[];
  @ApiProperty()
  name: string;
  @ApiProperty()
  oldPrice: number;
  @ApiProperty()
  newPrice: number;
  @ApiProperty()
  description: string;
}
