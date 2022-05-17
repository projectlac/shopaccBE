import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto, QueryUserDto } from '../dto';
import { AuthService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@Controller('hide-auth')
@ApiTags('hide-auth')
export class HideAuthController {
  constructor(private authService: AuthService) {}

  // @Post()
  // async createAdminUser(@Body() createUserDto: CreateUserDto) {
  //   return this.authService.createAdminUser(createUserDto);
  // }

  @Get()
  async getAllUser() {
    return this.authService.getAllUser();
  }

  @Get('list-user')
  async getAllUserList(@Query() queryUserDto: QueryUserDto) {
    return this.authService.getAllUserList(queryUserDto);
  }
}
