import { Query, Controller, Get } from '@nestjs/common';
import { QueryAccountDto } from '../dto';
import { AccountService } from '../service';
import { ApiTags } from '@nestjs/swagger';
@Controller('account-get')
@ApiTags('account-get')
export class AccountGetController {
  constructor(private accountService: AccountService) {}

  @Get()
  queryAccount(@Query() queryAccountDto: QueryAccountDto) {
    return this.accountService.queryAccount(queryAccountDto);
  }
}
