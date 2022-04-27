import { AUTH_MESSAGE, ROLE_CONTEXT } from '@/core';
import { UserWithOutPassword } from '@/entity';
import { HttpStatus } from '@nestjs/common';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      ROLE_CONTEXT,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserWithOutPassword = request.user;
    if (roles.includes(user.role)) return true;
    throw new HttpException(AUTH_MESSAGE.USER.ROLE, HttpStatus.UNAUTHORIZED);
  }
}
