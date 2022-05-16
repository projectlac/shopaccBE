import { CloundinaryService } from '@/cloudinary';
import {
  ACCOUNT_MESSAGE,
  AUDIT_MESSAGE,
  POST_CONFIG,
  QUILL_LIANG_EMAIL,
  TIM_DANG_EMAIL,
} from '@/core';
import { Account, ACCOUNT_RELATION, ACCOUNT_STATUS, User } from '@/entity';
import { HistoryService } from '@/history';
import { MailerService } from '@/mailer';
import {
  AccountRepository,
  DriverRepository,
  UserRepository,
} from '@/repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateAccountDto, QueryAccountDto, UpdateAccountDto } from '../dto';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private cloundinaryService: CloundinaryService,
    private connection: Connection,
    private historyService: HistoryService,
    private userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
    user: User,
    files: Array<Express.Multer.File>,
  ): Promise<Account> {
    return this.connection.transaction(async () => {
      const { ar, char, weapon } = createAccountDto;
      const cloundinary = await this.cloundinaryService.uploadMultiFilesAccount(
        files,
      );
      const charCount = char.length;
      const weaponCount = weapon.length;
      const charString = JSON.stringify(char);
      const weaponString = JSON.stringify(weapon);
      const imageUrl = JSON.stringify(
        cloundinary.map((d) => d.url || d.secure_url),
      );
      const newAccount = this.accountRepository.create({
        ar,
        ...createAccountDto,
        char: charString,
        weapon: weaponString,
        charCount,
        weaponCount,
        user,
        cloundinary,
        imageUrl,
      });
      return this.accountRepository.save(newAccount);
    });
  }

  // async updateAccount(
  //   updateAccountDto: UpdateAccountDto,
  //   id: string,
  //   file?: Express.Multer.File,
  // ): Promise<Account> {
  //   const account = await this.accountRepository.findOne({
  //     relations: [ACCOUNT_RELATION.CLOUNDINARY],
  //     where: {
  //       id,
  //     },
  //   });
  //   if (!account)
  //     throw new HttpException(ACCOUNT_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
  //   for (const property in updateAccountDto) {
  //     const value = updateAccountDto[property];
  //     if (value) {
  //       if (typeof value === 'number') {
  //         account[property] = value;
  //       } else {
  //         account[property] = JSON.stringify(value);
  //         account[`${property}Count`] = value.Length;
  //       }
  //     }
  //   }
  //   if (file) {
  //     const oldCloundinary = account.cloundinary.public_id;
  //     const cloundinary = await this.cloundinaryService.uploadFile(file);
  //     account.cloundinary = cloundinary;
  //     account.imageUrl = cloundinary.url || cloundinary.secure_url;
  //     await Promise.all([
  //       this.accountRepository.save(account),
  //       this.cloundinaryService.deleteFile(oldCloundinary),
  //     ]);
  //     return this.accountRepository.findOne({ id });
  //   }
  //   return this.accountRepository.save(account);
  // }

  async queryAccount(queryAccountDto: QueryAccountDto): Promise<Account[]> {
    const { offset = 0, limit = POST_CONFIG.LIMIT, weapon } = queryAccountDto;
    const findWeaponQuery = this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.cloundinary', 'cloundinary')
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
    const deleteMultiFile = account.cloundinary.map((cloud) => {
      return this.cloundinaryService.deleteFile(cloud.public_id);
    });
    return Promise.all([
      ...deleteMultiFile,
      this.accountRepository.delete(account),
    ]);
  }

  async buyAccountByUser(user: User, id: string) {
    return this.connection.transaction(async () => {
      const account = await this.accountRepository.checkExistAccount(id);
      // if (account.status === ACCOUNT_STATUS.SOLD || account.soldAt) {
      //   throw new HttpException(ACCOUNT_MESSAGE.SOLD, HttpStatus.BAD_GATEWAY);
      // }
      account.status = ACCOUNT_STATUS.SOLD;
      account.soldAt = new Date();
      if (user.money < account.newPrice) {
        throw new HttpException(
          AUDIT_MESSAGE.NOT_ENOUGH,
          HttpStatus.BAD_GATEWAY,
        );
      }
      user.money = user.money - account.newPrice;
      const listImage = account.cloundinary.map(
        (cl) => cl.secure_url || cl.url,
      );
      return Promise.all([
        this.userRepository.save(user),
        this.accountRepository.save(account),
        this.mailerService.sendBuyAccountFromUser(
          QUILL_LIANG_EMAIL,
          account,
          user.username,
          listImage,
        ),
        this.historyService.createHistoryBuyAccount({
          account,
          username: user.username,
        }),
      ]);
    });
  }
}
