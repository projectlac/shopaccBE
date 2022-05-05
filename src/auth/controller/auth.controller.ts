import { UserWithOutPassword, USER_ROLE } from '@/entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../decorator';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  LoginUserDto,
  UpdateUserRoleDto,
} from '../dto';
import { JwtAuthGuard, LocalAuthGuard, RolesGuard } from '../guard';
import { AuthService } from '../service';
import { ApiTags, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
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

  @Post('sign-up/:token')
  @ApiParam({
    name: 'token',
  })
  async submitSignUpUser(@Param('token') token: string) {
    return this.authService.submitCreateNewUser(token);
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

  @Patch('forget-password/:token')
  resetPassword(@Param('token') token: string) {
    return this.authService.verifyResetPassword(token);
  }

  @Patch('update-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRoleUser(@Body() updateUserRole: UpdateUserRoleDto) {
    return this.authService.updateUserRole(updateUserRole);
  }
}
