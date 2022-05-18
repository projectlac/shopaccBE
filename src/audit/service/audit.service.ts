import {
  AUDIT_MESSAGE,
  AUTH_MESSAGE,
  BaseQueryResponse,
  DEFAULT_CONFIG,
  HISTORY_MESSAGE,
} from '@/core';
import { Audit, AUDIT_RELATION, AUDIT_STATUS, History, User } from '@/entity';
import { MailerService } from '@/mailer';
import {
  AuditInformationRepository,
  AuditRepository,
  UserRepository,
} from '@/repository';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import {
  CreateAuditByAdminDto,
  CreateAuditDto,
  QueryAuditDto,
  TYPE_TRANSFER,
} from '../dto';
import { Connection } from 'typeorm';
import { HistoryService } from '@/history';
@Injectable()
export class AuditService {
  constructor(
    private auditRepository: AuditRepository,
    private userRepository: UserRepository,
    private auditInformationRepository: AuditInformationRepository,
    private mailerService: MailerService,
    private connection: Connection,
    private historyService: HistoryService,
  ) {}

  async createNewAudit(
    user: User,
    createAuditDto: CreateAuditDto,
  ): Promise<[Audit, any, History]> {
    return this.connection
      .transaction(async () => {
        const { auditInformation, username, password, ...newAudit } =
          createAuditDto;
        const auditInformations =
          await this.auditInformationRepository.createAuditInformations(
            auditInformation,
          );
        const audit = this.auditRepository.create({
          user,
          auditInformations,
          ...newAudit,
        });
        const savedAudit = await this.auditRepository.save(audit);
        await this.mailerService.sendAuditStoneMail(
          'lhongquan.1998@gmail.com',
          user.username,
          username,
          password,
          newAudit.server,
          newAudit.UID,
          auditInformations,
          savedAudit.total,
          newAudit.note,
        );
        await this.historyService.createHistoryCreateAudit({
          UID: newAudit.UID,
          username: user.username,
        });
        return Promise.all([
          this.auditRepository.save(audit),
          this.mailerService.sendAuditStoneMail(
            'lhongquan.1998@gmail.com',
            user.username,
            username,
            password,
            newAudit.server,
            newAudit.UID,
            auditInformations,
            savedAudit.total,
            newAudit.note,
          ),
          this.historyService.createHistoryCreateAudit({
            UID: newAudit.UID,
            username: user.username,
          }),
        ]);
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException(
          HISTORY_MESSAGE.NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async createAuditByAdmin(
    user: User,
    createAuditByAdminDto: CreateAuditByAdminDto,
  ): Promise<[User, Audit, History]> {
    return this.connection
      .transaction(async () => {
        const { username, ...createAudit } = createAuditByAdminDto;
        const userAudit = await this.userRepository.findOne({
          username,
        });
        if (!userAudit)
          throw new HttpException(
            AUTH_MESSAGE.USER.NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );
        const oldMoney = userAudit?.money || 0;
        let newMoney = +oldMoney;
        if (createAudit.typeTransfer === TYPE_TRANSFER.MINUS) {
          newMoney = newMoney - createAudit.amountTransferred;
          if (newMoney < 0) {
            throw new HttpException(
              AUDIT_MESSAGE.NOT_ENOUGH,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        if (createAudit.typeTransfer === TYPE_TRANSFER.PLUS) {
          newMoney = newMoney + createAudit.amountTransferred;
        }
        userAudit.money = newMoney;
        return Promise.all([
          this.userRepository.save(userAudit),
          this.auditRepository.save({ user: userAudit, ...createAudit }),
          this.historyService.createHistoryAmountTransferred({
            admin: user.username,
            oldMoney,
            newMoney,
            username: userAudit.username,
          }),
        ]);
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException(
          HISTORY_MESSAGE.NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async queryAuditByUser(
    queryAuditDto: QueryAuditDto,
    user?: User,
  ): Promise<BaseQueryResponse<Audit>> {
    const {
      limit = DEFAULT_CONFIG.LIMIT,
      offset = DEFAULT_CONFIG.OFFSET,
      status = '',
    } = queryAuditDto;
    const where = {};
    if (user) {
      where['user'] = user;
    }
    if (status) {
      where['status'] = status;
    }
    // const total = await this.auditRepository.count({ where });
    // const data = await this.auditRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where,
    //   relations: [AUDIT_RELATION.USER, AUDIT_RELATION.AUDIT_INFORMATIONS],
    // });
    const [total, data] = await Promise.all([
      this.auditRepository.count({ where }),
      this.auditRepository.find({
        take: limit,
        skip: offset,
        where,
        relations: [AUDIT_RELATION.USER, AUDIT_RELATION.AUDIT_INFORMATIONS],
      }),
    ]);
    return {
      total,
      data,
    };
  }

  async updateStatusAudit(user: User, id: string) {
    return this.connection
      .transaction(async () => {
        const audit = await this.auditRepository.findOne({
          status: AUDIT_STATUS.PENDING,
          id,
        });
        if (!audit)
          throw new HttpException(
            AUDIT_MESSAGE.STATUS_NOT_FOUND,
            HttpStatus.CONFLICT,
          );

        return Promise.all([
          this.historyService.createHistoryChangeStatusAudit({
            UID: audit.UID,
            admin: user.username,
            username: audit.user.username,
          }),
          this.auditRepository.update(
            { id },
            { status: AUDIT_STATUS.COMPLETED },
          ),
        ]);
      })
      .catch((err) => {
        console.log(err);
        throw new HttpException(
          HISTORY_MESSAGE.NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
