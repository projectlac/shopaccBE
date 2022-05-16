export interface CreateChangeRoleHistoryDto {
  admin: string;
  username: string;
  oldRole: string;
  newRole: string;
}

export abstract class CreateAmountTransferredHistoryDto {
  admin: string;
  username: string;
  oldMoney: number;
  newMoney: number;
}

export abstract class CreateCreateAuditHistoryDto {
  username: string;
  UID: string;
}

export abstract class CreateConfirmHistoryDto extends CreateCreateAuditHistoryDto {
  admin: string;
}
