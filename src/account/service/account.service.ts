import { ACCOUNT_MESSAGE, POST_CONFIG } from '@/core';
import { DriverService } from '@/driver';
import { Account, ACCOUNT_RELATION, User } from '@/entity';
import { AccountRepository, DriverRepository } from '@/repository';
import { HttpStatus } from '@nestjs/common';
import { Injectable, HttpException } from '@nestjs/common';
import { Like } from 'typeorm';
import { CreateAccountDto, QueryAccountDto, UpdateAccountDto } from '../dto';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private driverService: DriverService,
    private driverRepository: DriverRepository,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<Account> {
    const { ar, char, weapon } = createAccountDto;
    const driver = await this.driverService.uploadFile(file);
    const charCount = char.length;
    const weaponCount = weapon.length;
    const charString = JSON.stringify(char);
    const weaponString = JSON.stringify(weapon);
    const newAccount = this.accountRepository.create({
      ar,
      char: charString,
      weapon: weaponString,
      charCount,
      weaponCount,
      user,
      driver,
    });
    return this.accountRepository.save(newAccount);
  }

  async updateAccount(
    updateAccountDto: UpdateAccountDto,
    id: string,
    file?: Express.Multer.File,
  ): Promise<Account> {
    const account = await this.accountRepository.findOne({
      relations: [ACCOUNT_RELATION.DRIVER],
      where: {
        id,
      },
    });
    if (!account)
      throw new HttpException(ACCOUNT_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    for (const property in updateAccountDto) {
      const value = updateAccountDto[property];
      if (value) {
        if (typeof value === 'number') {
          account[property] = value;
        } else {
          account[property] = JSON.stringify(value);
        }
      }
    }
    if (file) {
      const oldDriverId = account.driver.driverId;
      const driver = await this.driverService.uploadFile(file);
      account.driver = driver;
      await Promise.all([
        this.accountRepository.save(account),
        this.driverRepository.delete({ driverId: oldDriverId }),
        this.driverService.deleteFile(oldDriverId),
      ]);
      return this.accountRepository.findOne({ id });
    }
    return this.accountRepository.save(account);
  }

  async queryAccount(queryAccountDto: QueryAccountDto): Promise<Account[]> {
    const { offset = 0, limit = POST_CONFIG.LIMIT, weapon } = queryAccountDto;
    let findWeaponQuery = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.driver', 'driver')
      .leftJoinAndSelect('account.user', 'user');
    if (weapon) {
      weapon.split(',').forEach((data) => {
        findWeaponQuery.andWhere('account.weapon ILIKE :data', {
          data: `%${data}%`,
        });
      });
    }
    return findWeaponQuery.offset(offset).limit(limit).getMany();
  }
}
