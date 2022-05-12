export type CreateHistoryDto = CreateChangeRoleHistoryDto


export class CreateChangeRoleHistoryDto{
    admin:string
    username:string
    oldRole:string
    newRole:string
}