import { BaseQueryResponse, DEFAULT_CONFIG, HISTORY_MESSAGE } from '@/core';
import { History, HISTORY_TYPE } from '@/entity';
import { HistoryRepository } from '@/repository';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  CreateAmountTransferredHistoryDto,
  CreateBuyAccountHistoryDto,
  CreateChangeRoleHistoryDto,
  CreateConfirmHistoryDto,
  CreateCreateAuditHistoryDto,
  QueryHistoryDto,
} from '../dto';
import {
  getHistoryAmountTransferredMessage,
  getHistoryBuyAccountMessage,
  getHistoryChangeRoleMessage,
  getHistoryConfirmMessage,
  getHistoryCreateAuditMessage,
} from '../util';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}

  async createHistoryAmountTransferred(
    createHistory: CreateAmountTransferredHistoryDto,
  ): Promise<History> {
    const historyMessage = getHistoryAmountTransferredMessage(createHistory);
    return this.historyRepository.save(
      this.historyRepository.create({
        historyMessage,
        type: HISTORY_TYPE.AMOUNT_TRANSFERRED,
      }),
    );
  }
  async createHistoryChangeStatusAudit(
    createHistory: CreateConfirmHistoryDto,
  ): Promise<History> {
    const historyMessage = getHistoryConfirmMessage(createHistory);
    return this.historyRepository.save(
      this.historyRepository.create({
        historyMessage,
        type: HISTORY_TYPE.CHANGE_STATUS_AUDIT,
      }),
    );
  }
  async createHistoryCreateAudit(
    createHistory: CreateCreateAuditHistoryDto,
  ): Promise<History> {
    const historyMessage = getHistoryCreateAuditMessage(createHistory);
    return this.historyRepository.save(
      this.historyRepository.create({
        historyMessage,
        type: HISTORY_TYPE.CREATE_AUDIT,
      }),
    );
  }
  async createHistoryChangeRole(
    createHistory: CreateChangeRoleHistoryDto,
  ): Promise<History> {
    const historyMessage = getHistoryChangeRoleMessage(createHistory);
    return this.historyRepository.save(
      this.historyRepository.create({
        historyMessage,
        type: HISTORY_TYPE.CHANGE_ROLE,
      }),
    );
  }

  async createHistoryBuyAccount(
    createHistory: CreateBuyAccountHistoryDto,
  ): Promise<History> {
    const historyMessage = getHistoryBuyAccountMessage(createHistory);
    return this.historyRepository.save(
      this.historyRepository.create({
        historyMessage,
        type: HISTORY_TYPE.BUY_ACCOUNT_BY_USER,
      }),
    );
  }

  async queryHistory(
    queryHistory: QueryHistoryDto,
  ): Promise<BaseQueryResponse<History>> {
    const { offset = DEFAULT_CONFIG.OFFSET, limit = DEFAULT_CONFIG.LIMIT } =
      queryHistory;
    const findHistoryQuery = this.historyRepository
      .createQueryBuilder('history')
      .offset(offset)
      .limit(limit);
    // const total = await this.historyRepository.count();
    // const data = await findHistoryQuery.getMany();
    const [total, data] = await Promise.all([
      this.historyRepository.count(),
      findHistoryQuery.getMany(),
    ]);
    return { total, data };
  }
}
