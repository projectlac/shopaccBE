import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto';
import { AuthService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@Controller('hide-auth')
@ApiTags('hide-auth')
export class HideAuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async createAdminUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createAdminUser(createUserDto);
  }

  @Get()
  async getAllUser() {
    return this.authService.getAllUser();
  }
}
