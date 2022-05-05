import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { MOD_ADMIN_ROLE } from '@/core';
import { User, UserWithOutPassword } from '@/entity';
import { Query } from '@nestjs/common';
import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { CreateAuditByAdminDto, CreateAuditDto, QueryAuditDto } from '../dto';
import { AuditService } from '../service';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Post()
  async createNewAudit(
    @CurrentUser() user: User,
    @Body() createAuditDto: CreateAuditDto,
  ) {
    return this.auditService.createNewAudit(user, createAuditDto);
  }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(...MOD_ADMIN_ROLE)
  async createAuditByAdmin(@Body() createAuditByAdmin: CreateAuditByAdminDto) {
    return this.auditService.createAuditByAdmin(createAuditByAdmin);
  }

  @Get()
  async getAuditHistory(
    @CurrentUser() user: User,
    @Query() queryAuditDto: QueryAuditDto,
  ) {
    return this.auditService.queryAuditByUser(user, queryAuditDto);
  }
}
