import { DEFAULT_CONFIG } from '@/core';
import { History, HISTORY_TYPE } from '@/entity';
import { HistoryRepository } from '@/repository';
import { Injectable } from '@nestjs/common';
import { CreateHistoryDto, QueryHistoryDto } from '../dto';
import { getHistoryChangeRoleMessage } from '../util';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}

  async createHistory(createHistory: CreateHistoryDto, type: HISTORY_TYPE) {
    if (type === HISTORY_TYPE.AMOUNT_TRANSFERRED) {
      return this.createHistoryAmountTransferred(createHistory);
    }
    if (type === HISTORY_TYPE.CHANGE_STATUS_AUDIT) {
      return this.createHistoryChangeStatusAudit(createHistory)
    }
    if(type === HISTORY_TYPE.CREATE_AUDIT){
      return this.createHistoryCreateAudit(createHistory)
    }
    if(type === HISTORY_TYPE.CHANGE_ROLE){
      return this.createHistoryChangeRole(createHistory)
    }
  }

  async createHistoryAmountTransferred(createHistory: CreateHistoryDto) {}
  async createHistoryChangeStatusAudit(createHistory: CreateHistoryDto) {}
  async createHistoryCreateAudit(createHistory: CreateHistoryDto) {}
  async createHistoryChangeRole(createHistory: CreateHistoryDto):Promise<History> {
    const {admin,newRole,oldRole,username} = createHistory
    const historyMessage = getHistoryChangeRoleMessage(createHistory)
    return this.historyRepository.save(this.historyRepository.create({historyMessage,type:HISTORY_TYPE.CHANGE_ROLE}))
  }

  async queryHistory(queryHistory:QueryHistoryDto):Promise<History[]>{
    const {offset=DEFAULT_CONFIG.OFFSET,limit=DEFAULT_CONFIG.LIMIT} = queryHistory
    const findHistoryQuery = this.historyRepository.createQueryBuilder('history').offset(offset).limit(limit)
    return findHistoryQuery.getMany()
  }
  
}
