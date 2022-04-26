import { UserWithOutPassword } from '@/entity';
import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CurrentUser } from '../decorator';
import { ChangePasswordDto, CreateUserDto, ForgetPasswordDto } from '../dto';
import { JwtAuthGuard, LocalAuthGuard } from '../guard';
import { AuthService } from '../service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() currentUser: UserWithOutPassword) {
    return this.authService.login(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: UserWithOutPassword) {
    return currentUser;
  }

  @Post('sign-up')
  async signUpUser(@Body() newUserDto: CreateUserDto) {
    return this.authService.createNewUser(newUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(
    @CurrentUser() currentUser: UserWithOutPassword,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changeUserPassword(
      changePasswordDto,
      currentUser.username,
    );
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Patch('reset-password/:token')
  resetPassword(@Param('token') token: string) {
    return this.authService.verifyResetPassword(token);
  }
}
