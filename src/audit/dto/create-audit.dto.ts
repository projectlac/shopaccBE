import { AUDIT_TYPE } from '@/entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TYPE_TRANSFER {
  PLUS = 'PLUS',
  MINUS = 'MINUS',
}
export class CreateAuditDto {
  @ApiProperty()
  UID: string;
  @ApiProperty()
  server: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  accountName: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  note: string;
  @ApiProperty({ type: () => [AuditInformationDto] })
  auditInformation: AuditInformationDto[];
}

export class CreateAuditByAdminDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  typeAudit: AUDIT_TYPE;
  @ApiProperty()
  amountTransferred: number;
  @ApiProperty()
  typeTransfer: TYPE_TRANSFER;
}

export class AuditInformationDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  unitPrice: number;
}
