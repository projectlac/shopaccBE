import { hashedPassword } from '@/core';
import { USER_ROLE } from '@/entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAdminAccount1651135487635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await hashedPassword('admin');
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values([
        {
          username: 'adminquill',
          password,
          role: USER_ROLE.ADMIN,
          confirmedEmail: true,
          email: 'lhongquan.1998@gmail.com',
        },
        {
          username: 'admintim',
          password,
          role: USER_ROLE.ADMIN,
          confirmedEmail: true,
          //   email: 'lhongquan.1998@gmail.com',
        },
        {
          username: 'admin',
          password,
          role: USER_ROLE.ADMIN,
          confirmedEmail: true,
          //   email: 'lhongquan.1998@gmail.com',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
