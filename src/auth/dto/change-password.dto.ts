import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordDto {
  @ApiProperty()
  newPassword: string;
  @ApiProperty()
  confirmNewPassword: string;
}

export class ForgetPasswordDto extends NewPasswordDto {
  @ApiProperty()
  username: string;
}

export class ChangePasswordDto extends NewPasswordDto {
  @ApiProperty()
  oldPassword: string;
}
