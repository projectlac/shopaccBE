import { AUTH_MESSAGE } from '@/core';
import { User } from '@/entity';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkExistUser(id: string): Promise<User> {
    const user = await this.findOne({ id });
    if (!user) throw new NotFoundException(AUTH_MESSAGE.USER.NOT_FOUND);
    return user;
  }
}
