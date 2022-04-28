import { POST_CONFIG } from '@/core';

export class QueryPostDto {
  offset?: number;
  limit?: number;
}

export class QueryPostTagDto extends QueryPostDto {
  tag: string;
}
