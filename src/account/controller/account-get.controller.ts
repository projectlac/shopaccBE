import { Query, Controller, Get } from '@nestjs/common';
import { QueryAccountDto } from '../dto';
import { AccountService } from '../service';
@Controller('account-get')
export class AccountGetController {
  constructor(private accountService: AccountService) {}

  @Get()
  queryAccount(@Query() queryAccountDto: QueryAccountDto) {
    return this.accountService.queryAccount(queryAccountDto);
  }
}
