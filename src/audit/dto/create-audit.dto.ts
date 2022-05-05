import { ApiProperty } from "@nestjs/swagger";

export class CreateAuditDto {
    @ApiProperty()
  auditInformation: string;
}

export class CreateAuditByAdminDto extends CreateAuditDto {
    @ApiProperty()
    username: string;
}
