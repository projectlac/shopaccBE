import { Query, Controller, Get } from '@nestjs/common';
import { QueryAccountDto } from '../dto';
import { AccountService } from '../service';
import { ApiTags } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { GetAccountInterceptor } from '../interceptor';
@Controller('account-get')
@ApiTags('account-get')
export class AccountGetController {
  constructor(private accountService: AccountService) {}

  @Get()
  @UseInterceptors(GetAccountInterceptor)
  queryAccount(@Query() queryAccountDto: QueryAccountDto) {
    return this.accountService.queryAccount(queryAccountDto);
  }
}
