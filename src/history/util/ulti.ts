import { CreateChangeRoleHistoryDto } from "../dto";

export const getHistoryChangeRoleMessage=(historyChangeRole: CreateChangeRoleHistoryDto):string=>{
    const {admin,newRole,oldRole,username}= historyChangeRole
    return `Admin ${admin} đổi quyển người dùng ${username} từ ${oldRole} sang ${newRole}`
}