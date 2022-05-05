import { AUTH_MESSAGE, DEFAULT_CONFIG } from '@/core';
import { Audit, User, UserWithOutPassword } from '@/entity';
import { AuditRepository, UserRepository } from '@/repository';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { CreateAuditByAdminDto, CreateAuditDto, QueryAuditDto } from '../dto';

@Injectable()
export class AuditService {
  constructor(
    private auditRepository: AuditRepository,
    private userRepository: UserRepository,
  ) {}

  async createNewAudit(
    user: User,
    createAuditDto: CreateAuditDto,
  ): Promise<Audit> {
    return this.auditRepository.save({ user, ...createAuditDto });
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
