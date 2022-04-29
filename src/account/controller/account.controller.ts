import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { User, USER_ROLE } from '@/entity';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { CreateAccountDto, UpdateAccountDto } from '../dto';
import { AccountService } from '../service';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
@Controller('account')
@ApiTags('account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createNewAccount(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.accountService.createAccount(createAccountDto, user, file);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const randomName = uuid();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiParam({
    name: 'id',
  })
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.accountService.updateAccount(updateAccountDto, id, file);
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN, USER_ROLE.MOD)
  async deleteAccount(@Param('id') id: string) {
    return this.accountService.removeAccount(id);
  }
}
