import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_CONFIG } from '@/core';
import { PayloadTokenUser } from '@/entity';
import { UserRepository } from '@/repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.SECRET,
    });
  }

  async validate(payload: PayloadTokenUser) {
    const user = await this.userRepository.findOne({
      username: payload.username,
    });
    return user;
  }
}
