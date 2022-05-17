import { Get } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryHistoryDto } from '../dto';
import { HistoryService } from '../service';

@Controller('history')
@ApiTags('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  async getHistory(@Query() queryHistoryDto: QueryHistoryDto) {
    return this.historyService.queryHistory(queryHistoryDto);
  }
}
