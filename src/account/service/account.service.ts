import { CloundinaryService } from '@/cloudinary';
import { ACCOUNT_MESSAGE, POST_CONFIG } from '@/core';
import { Account, ACCOUNT_RELATION, User } from '@/entity';
import { AccountRepository, DriverRepository } from '@/repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAccountDto, QueryAccountDto, UpdateAccountDto } from '../dto';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private cloundinaryService: CloundinaryService,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<Account> {
    const { ar, char, weapon } = createAccountDto;
    const cloundinary = await this.cloundinaryService.uploadFile(file);
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
      cloundinary,
    });
    return this.accountRepository.save(newAccount);
  }

  async updateAccount(
    updateAccountDto: UpdateAccountDto,
    id: string,
    file?: Express.Multer.File,
  ): Promise<Account> {
    const account = await this.accountRepository.findOne({
      relations: [ACCOUNT_RELATION.CLOUNDINARY],
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
          account[`${property}Count`] = value.Length;
        }
      }
    }
    if (file) {
      const oldCloundinary = account.cloundinary.public_id;
      const cloundinary = await this.cloundinaryService.uploadFile(file);
      account.cloundinary = cloundinary;
      await Promise.all([
        this.accountRepository.save(account),
        this.cloundinaryService.deleteFile(oldCloundinary),
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

  async removeAccount(id: string) {
    const account = await this.accountRepository.findOne({ id });
    if (!id)
      throw new HttpException(ACCOUNT_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    return Promise.all([
      this.cloundinaryService.deleteFile(account.cloundinary.public_id),
      this.accountRepository.delete(account),
    ]);
  }
}
