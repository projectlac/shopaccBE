import { AUTH_MESSAGE, DEFAULT_CONFIG } from '@/core';
import { Audit, User, UserWithOutPassword } from '@/entity';
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
  ) {}

  async createNewAudit(
    user: User,
    createAuditDto: CreateAuditDto,
  ): Promise<Audit> {
    const { auditInformation, ...newAudit } = createAuditDto;
    const auditInformations =
      await this.auditInformationRepository.createAuditInformations(
        auditInformation,
      );
    const audit = this.auditRepository.create({
      user,
      auditInformations,
      ...newAudit,
    });
    return this.auditRepository.save(audit);
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
    user: User,
    queryAuditDto: QueryAuditDto,
  ): Promise<Audit[]> {
    const { limit = DEFAULT_CONFIG.LIMIT, offset = DEFAULT_CONFIG.OFFSET } =
      queryAuditDto;
    return this.auditRepository.find({
      take: limit,
      skip: offset,
      where: { user },
    });
  }
}
