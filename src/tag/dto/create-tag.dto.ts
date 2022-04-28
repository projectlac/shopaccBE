import { IsNotEmpty } from "class-validator";

export class CreateTagDto{
    @IsNotEmpty({message:'Title cannot be empty'})
    title: string
    @IsNotEmpty({message:'Content must be fill'})
    content:string
}