import {MigrationInterface, QueryRunner} from "typeorm";

export class createDb1652842292773 implements MigrationInterface {
    name = 'createDb1652842292773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "audit" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "audit" ADD "accountName" character varying`);
        await queryRunner.query(`ALTER TABLE "audit" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "audit" DROP COLUMN "accountName"`);
        await queryRunner.query(`ALTER TABLE "audit" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "audit" DROP COLUMN "username"`);
    }

}
