import { POST_CONFIG } from '@/core';
import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  tags: [string];
}
