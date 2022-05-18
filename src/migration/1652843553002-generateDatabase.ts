import { MigrationInterface, QueryRunner } from 'typeorm';

export class generateDatabase1652843553002 implements MigrationInterface {
  name = 'generateDatabase1652843553002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cloundinary" ("public_id" character varying NOT NULL, "asset_id" character varying, "version" integer, "version_id" character varying, "signature" character varying, "width" integer, "height" integer, "format" character varying, "resource_type" character varying NOT NULL, "created_at" TIMESTAMP, "bytes" integer, "type" character varying, "etag" character varying, "url" text NOT NULL DEFAULT '', "secure_url" text NOT NULL DEFAULT '', "original_filename" character varying, "original_extension" character varying, "api_key" character varying, "isBanner" boolean DEFAULT false, "order" integer DEFAULT '0', "accountId" uuid, CONSTRAINT "PK_40b7f78db8f5b5bb00d738bd65a" PRIMARY KEY ("public_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "slug" character varying, "information" text NOT NULL, "type" character varying NOT NULL DEFAULT 'WEAPON', CONSTRAINT "UQ_ea660f2baf9c3f3141d7c2ef531" UNIQUE ("title"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auditInformation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying, "quantity" integer, "unitPrice" integer, "total" integer, "auditId" uuid, CONSTRAINT "PK_2940f5770f41ba04cec3fa6e703" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "UID" character varying, "server" character varying, "username" character varying, "password" character varying, "accountName" character varying, "phone" character varying, "note" character varying, "total" integer, "status" character varying NOT NULL DEFAULT 'PENDING', "type" character varying NOT NULL DEFAULT 'STONE', "userId" uuid, CONSTRAINT "PK_1d3d120ddaf7bc9b1ed68ed463a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying NOT NULL, "slug" character varying, "content" text NOT NULL, "description" text, "imageUrl" character varying, "cloundinaryPublicId" character varying, "userId" uuid, CONSTRAINT "REL_6cd0258bc7d0d3bf4707895b13" UNIQUE ("cloundinaryPublicId"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "username" character varying NOT NULL, "email" character varying, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "confirmedEmail" boolean NOT NULL DEFAULT false, "isRecievePost" boolean NOT NULL DEFAULT false, "avatar" integer DEFAULT '1', "money" bigint DEFAULT '0', "phone" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "order" SERIAL NOT NULL, "oldPrice" integer NOT NULL DEFAULT '0', "newPrice" integer NOT NULL DEFAULT '0', "name" text, "description" text NOT NULL, "status" character varying NOT NULL DEFAULT 'AVAILABLE', "ar" integer NOT NULL, "soldAt" TIMESTAMP, "imageUrl" text, "userId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "driver" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "driverId" character varying NOT NULL, "webContentLink" text NOT NULL DEFAULT '', "filename" text NOT NULL DEFAULT '', "mimeType" character varying NOT NULL, "webViewLink" character varying NOT NULL, "isBanner" boolean DEFAULT false, "order" integer DEFAULT '0', CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "historyMessage" text NOT NULL DEFAULT true, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag_accounts_account" ("tagId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_759fde8bae4c19723b6dc72c85e" PRIMARY KEY ("tagId", "accountId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4121f1577f3dc85cebd9b109aa" ON "tag_accounts_account" ("tagId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae9f2234d7f72bf22437186fda" ON "tag_accounts_account" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post_tags_tag" ("postId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_e9b7b8e6a07bdccb6a954171676" PRIMARY KEY ("postId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b651178cc41334544a7a9601c4" ON "post_tags_tag" ("postId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_41e7626b9cc03c5c65812ae55e" ON "post_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cloundinary" ADD CONSTRAINT "FK_d465d84c96697a409b7117ccd98" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auditInformation" ADD CONSTRAINT "FK_76f53a1b0bc32bd119d03134bb6" FOREIGN KEY ("auditId") REFERENCES "audit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit" ADD CONSTRAINT "FK_7ae389e858ad6f2c0c63112e387" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_6cd0258bc7d0d3bf4707895b13b" FOREIGN KEY ("cloundinaryPublicId") REFERENCES "cloundinary"("public_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_accounts_account" ADD CONSTRAINT "FK_4121f1577f3dc85cebd9b109aa7" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_accounts_account" ADD CONSTRAINT "FK_ae9f2234d7f72bf22437186fda1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_b651178cc41334544a7a9601c45" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" ADD CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_41e7626b9cc03c5c65812ae55e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tags_tag" DROP CONSTRAINT "FK_b651178cc41334544a7a9601c45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_accounts_account" DROP CONSTRAINT "FK_ae9f2234d7f72bf22437186fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_accounts_account" DROP CONSTRAINT "FK_4121f1577f3dc85cebd9b109aa7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_6cd0258bc7d0d3bf4707895b13b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit" DROP CONSTRAINT "FK_7ae389e858ad6f2c0c63112e387"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auditInformation" DROP CONSTRAINT "FK_76f53a1b0bc32bd119d03134bb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cloundinary" DROP CONSTRAINT "FK_d465d84c96697a409b7117ccd98"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_41e7626b9cc03c5c65812ae55e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b651178cc41334544a7a9601c4"`,
    );
    await queryRunner.query(`DROP TABLE "post_tags_tag"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae9f2234d7f72bf22437186fda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4121f1577f3dc85cebd9b109aa"`,
    );
    await queryRunner.query(`DROP TABLE "tag_accounts_account"`);
    await queryRunner.query(`DROP TABLE "history"`);
    await queryRunner.query(`DROP TABLE "driver"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "audit"`);
    await queryRunner.query(`DROP TABLE "auditInformation"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "cloundinary"`);
  }
}
