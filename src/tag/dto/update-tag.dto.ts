import { ApiProperty } from "@nestjs/swagger"

export class UpdateTagDto{
  @ApiProperty()
  title?:string
  @ApiProperty()
  content?:string
}