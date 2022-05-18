import { hashedPassword } from '@/core';
import { USER_ROLE } from '@/entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as reader from 'xlsx';

export class updateUser1652323823166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const file = reader.readFile('./db/oldUser.xlsx');
    const adminPassword = await hashedPassword('admin');
    const sheets = file.SheetNames;
    let data = [];
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach(({ username, email, phone, role, password }) => {
        const truePhone = phone ? +`0${phone}` : '';
        const trueRole = role === '1' ? USER_ROLE.ADMIN : USER_ROLE.USER;
        data.push({
          username,
          email,
          phone: truePhone,
          role: trueRole,
          password: trueRole === USER_ROLE.ADMIN ? adminPassword : password,
          confirmedEmail: true,
        });
      });
    }
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values(data)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
