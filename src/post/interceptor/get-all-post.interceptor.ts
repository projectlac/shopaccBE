import { BaseQueryResponse } from '@/core';
import { Post } from '@/entity';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { changeToSlug } from '../util';

@Injectable()
export class GetAllPostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(
      map((data: BaseQueryResponse<Post>) => {
        const formattedData = data.data.map(
          ({
            content,
            updatedAt,
            description,
            id,
            title,
            cloundinary,
            slug,
            createdAt,
          }) => ({
            content,
            updatedAt,
            description,
            id,
            title,
            cloundinary: cloundinary.url || cloundinary.secure_url,
            slug: slug ? slug : changeToSlug(title, createdAt),
          }),
        );
        return { ...data, data: formattedData };
      }),
    );
  }
}
