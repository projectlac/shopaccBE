import { USER_ROLE } from '@/entity';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserRoleDto{
  @IsNotEmpty()
  username:string
  @IsNotEmpty()
  role: USER_ROLE
}