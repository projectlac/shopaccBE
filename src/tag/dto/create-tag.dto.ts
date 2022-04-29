import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTagDto{
  @ApiProperty()
  @IsNotEmpty({message:'Title cannot be empty'})
    title: string
  @ApiProperty()
  @IsNotEmpty({message:'Content must be fill'})
    content:string
}