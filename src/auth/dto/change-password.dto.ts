export class NewPasswordDto {
  newPassword: string;
  confirmNewPassword: string;
}

export class ForgetPasswordDto extends NewPasswordDto {
  username: string;
}

export class ChangePasswordDto extends NewPasswordDto {
  oldPassword: string;
}

export interface ResetPasswordPayload {
  username: string;
  password: string;
  expiredTime: Date;
}
