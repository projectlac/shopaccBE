import { changeToSlug } from '@/post';
import { PostRepository } from '@/repository';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSlugPost1652770167731 implements MigrationInterface {
  constructor(private postRepository: PostRepository) {}
  public async up(queryRunner: QueryRunner): Promise<void> {
    const listPostNoSlug = await this.postRepository.find({
      where: [{ slug: '' }, { slug: null }],
    });
    const promiseUpdateSlug = listPostNoSlug.map((post) =>
      this.postRepository.save({
        ...post,
        slug: changeToSlug(post.title, post.createdAt),
      }),
    );
    await Promise.all([...promiseUpdateSlug]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
