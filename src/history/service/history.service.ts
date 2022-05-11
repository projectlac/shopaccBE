import { HistoryRepository } from '@/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}
}
