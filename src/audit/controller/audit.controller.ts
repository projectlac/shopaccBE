import { CurrentUser, JwtAuthGuard, Roles, RolesGuard } from '@/auth';
import { MOD_ADMIN_ROLE } from '@/core';
import { User } from '@/entity';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Controller, UseGuards, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuditByAdminDto, CreateAuditDto, QueryAuditDto } from '../dto';
import { AuditService } from '../service';

@Controller('audit')
@ApiTags('audit')
@UseGuards(JwtAuthGuard,RolesGuard)
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
  @Roles(...MOD_ADMIN_ROLE)
  async createAuditByAdmin(@Body() createAuditByAdmin: CreateAuditByAdminDto) {
    return this.auditService.createAuditByAdmin(createAuditByAdmin);
  }

  @Get()
  async getAuditHistory(
    @CurrentUser() user: User,
    @Query() queryAuditDto: QueryAuditDto,
  ) {
    return this.auditService.queryAuditByUser( queryAuditDto,user);
  }

  @Get('all')
  @Roles(...MOD_ADMIN_ROLE)
  async getAllAuditHistory(
    @Query() queryAuditDto: QueryAuditDto,
  ) {
    return this.auditService.queryAuditByUser(queryAuditDto);
  }

  @Patch('update/:id')
  @UseGuards(RolesGuard)
  @Roles(...MOD_ADMIN_ROLE)
  async updateStatusAudit(@CurrentUser() user: User, @Param('id') id: string) {
    return this.auditService.updateStatusAudit(user, id);
  }
}
