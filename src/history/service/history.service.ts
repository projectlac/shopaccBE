import { DEFAULT_CONFIG, HISTORY_MESSAGE } from '@/core';
import { History, HISTORY_TYPE } from '@/entity';
import { HistoryRepository } from '@/repository';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import {
  CreateAmountTransferredHistoryDto,
  CreateChangeRoleHistoryDto,
  CreateConfirmHistoryDto,
  CreateCreateAuditHistoryDto,
  QueryHistoryDto,
} from '../dto';
import {
  getHistoryAmountTransferredMessage,
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

  async queryHistory(queryHistory: QueryHistoryDto): Promise<History[]> {
    const { offset = DEFAULT_CONFIG.OFFSET, limit = DEFAULT_CONFIG.LIMIT } =
      queryHistory;
    const findHistoryQuery = this.historyRepository
      .createQueryBuilder('history')
      .offset(offset)
      .limit(limit);
    return findHistoryQuery.getMany();
  }
}
