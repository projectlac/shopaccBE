import { TAG_TYPE } from '@/entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class createServerTag1652837181649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const listServerTag = [
      {
        title: 'America',
        description: 'America Server',
        type: TAG_TYPE.SERVER,
      },
      {
        title: 'Europe',
        description: 'Europe Server',
        type: TAG_TYPE.SERVER,
      },
      {
        title: 'Asia',
        description: 'Asia Server',
        type: TAG_TYPE.SERVER,
      },
      {
        title: 'TW, HK, MO',
        description: 'TW, HK, MO Server',
        type: TAG_TYPE.SERVER,
      },
    ];
    const saveServerList = listServerTag.map((server) => {
      const { title, type, ...inf } = server;
      const information = JSON.stringify(inf);
      return {
        title,
        type,
        information,
        slug: title.toLowerCase(),
      };
    });
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tag')
      .values(saveServerList)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
