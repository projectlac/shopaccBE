import { hashedPassword } from "@/core";
import { USER_ROLE } from "@/entity";
import {MigrationInterface, QueryRunner} from "typeorm";

export class createAdminAccount1651135487635 implements MigrationInterface {

    listTag = [{
        title:'event',
        content:"Event"
    },{
        title:'news',
        content:"News"
    }]
    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = await hashedPassword('admin')
        await Promise.all([queryRunner.manager.createQueryBuilder().insert().into('user').values({
            username:'adminquill',
            password,
            role: USER_ROLE.ADMIN,
            confirmedEmail:true,
            email:'lhongquan.1998@gmail.com'
        }).execute(),await queryRunner.manager.createQueryBuilder().insert().into('tag').values(this.listTag).execute()])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
