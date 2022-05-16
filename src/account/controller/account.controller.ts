import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { MOD_ADMIN_ROLE } from '@/core';
import { User } from '@/entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { CreateAccountDto } from '../dto';
import { AccountService } from '../service';
@Controller('account')
@ApiTags('account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Roles(...MOD_ADMIN_ROLE)
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
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
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.accountService.createAccount(createAccountDto, user, files);
  }

  @Patch('buy/:id')
  async buyAccount(@CurrentUser() user: User, @Param('id') id: string) {
    return this.accountService.buyAccountByUser(user, id);
  }

  // @Patch('update/:id')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (_req, file, cb) => {
  //         const randomName = uuid();
  //         cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // @ApiParam({
  //   name: 'id',
  // })
  // async updateAccount(
  //   @Param('id') id: string,
  //   @Body() updateAccountDto: UpdateAccountDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.accountService.updateAccount(updateAccountDto, id, file);
  // }
  @Delete(':id')
  @Roles(...MOD_ADMIN_ROLE)
  async deleteAccount(@Param('id') id: string) {
    return this.accountService.removeAccount(id);
  }
}
