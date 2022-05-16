import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateMoneyAdmin1652694879860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `update "user" set "money" =999999999999 where username ='admintim'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
