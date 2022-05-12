import { HISTORY_TYPE } from '@/entity';
import { HistoryRepository } from '@/repository';
import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from '../dto';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}

  async createHistory(createHistory: CreateHistoryDto,type: HISTORY_TYPE){
    if(type === HISTORY_TYPE.AMOUNT_TRANSERRED){}
  }
}
