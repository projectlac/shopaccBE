import { BaseQuery } from '@/core';
import { AUDIT_STATUS } from '@/entity';
import { ApiProperty } from '@nestjs/swagger';

export class QueryAuditDto extends BaseQuery {
  @ApiProperty()
  status?: AUDIT_STATUS;
}
