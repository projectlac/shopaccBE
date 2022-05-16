import { ACCOUNT_MESSAGE } from '@/core';
import { Account, ACCOUNT_RELATION } from '@/entity';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async checkExistAccount(id: string): Promise<Account> {
    const account = await this.findOne({
      where: { id },
      relations: [ACCOUNT_RELATION.CLOUNDINARY],
    });
    if (!account) throw new NotFoundException(ACCOUNT_MESSAGE.NOT_FOUND);
    return account;
  }
}
