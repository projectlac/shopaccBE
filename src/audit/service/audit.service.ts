import { AUDIT_MESSAGE, AUTH_MESSAGE, DEFAULT_CONFIG } from '@/core';
import { Audit, AUDIT_RELATION, AUDIT_STATUS, User, UserWithOutPassword } from '@/entity';
import { MailerService } from '@/mailer';
import {
  AuditInformationRepository,
  AuditRepository,
  UserRepository,
} from '@/repository';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { CreateAuditByAdminDto, CreateAuditDto, QueryAuditDto } from '../dto';

@Injectable()
export class AuditService {
  constructor(
    private auditRepository: AuditRepository,
    private userRepository: UserRepository,
    private auditInformationRepository: AuditInformationRepository,
    private mailerService: MailerService
  ) {}

  async createNewAudit(
    user: User,
    createAuditDto: CreateAuditDto,
  ): Promise<Audit> {
    const { auditInformation,username,password, ...newAudit } = createAuditDto;
    const auditInformations =
      await this.auditInformationRepository.createAuditInformations(
        auditInformation,
      );
    const audit = this.auditRepository.create({
      user,
      auditInformations,
      ...newAudit,
    });
    const savedAudit = await  this.auditRepository.save(audit);
    await this.mailerService.sendAuditStoneMail('lhongquan.1998@gmail.com', user.username,username,password,newAudit.server,newAudit.UID,auditInformations,savedAudit.total,newAudit.note)
    
    return savedAudit
  }

  async createAuditByAdmin(
    createAuditByAdminDto: CreateAuditByAdminDto,
  ): Promise<Audit> {
    const { username, ...createAudit } = createAuditByAdminDto;
    const user = await this.userRepository.findOne({
      username,
    });
    if (!user)
      throw new HttpException(
        AUTH_MESSAGE.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    return this.auditRepository.save({ user, ...createAudit });
  }

  async queryAuditByUser(
    queryAuditDto: QueryAuditDto,
    user?: User,
  ): Promise<Audit[]> {
    const { limit = DEFAULT_CONFIG.LIMIT, offset = DEFAULT_CONFIG.OFFSET } =
      queryAuditDto;
      const where = user ? {user} : {}
    return this.auditRepository.find({
      take: limit,
      skip: offset,
      where,
      relations:[AUDIT_RELATION.USER,AUDIT_RELATION.AUDIT_INFORMATIONS]
    });
  }


  async updateStatusAudit(user: User, id: string) {
    const audit = await this.auditRepository.findOne({
      status: AUDIT_STATUS.PENDING,
      id,
    });
    if (!audit)
      throw new HttpException(
        AUDIT_MESSAGE.STATUS_NOT_FOUND,
        HttpStatus.CONFLICT,
      );
    return this.auditRepository.update(
      { id },
      { status: AUDIT_STATUS.COMPLETED },
    );
  }
}
