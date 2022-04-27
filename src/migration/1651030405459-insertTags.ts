import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertTags1651030405459 implements MigrationInterface {
  listTags = [
    { title: 'event', content: 'Event' },
    {
      title: 'news',
      content: 'News',
    },
  ];
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tag')
      .values(this.listTags)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
