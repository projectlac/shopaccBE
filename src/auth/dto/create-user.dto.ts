import { USER_ROLE } from '@/entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;
  @ApiProperty()
  @IsNotEmpty()
  role: USER_ROLE;
}

export class LoginUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
