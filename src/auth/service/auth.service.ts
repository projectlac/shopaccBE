import { getExpiredTime } from './../../mailer/util/common';
import {
  AUTH_MESSAGE,
  checkIsMatchPassword,
  hashedPassword,
  JWT_EMAIL_CONFIG,
} from '@/core/';
import { PayloadTokenUser, User, UserWithOutPassword } from '@/entity';
import { MailerService } from '@/mailer';
import { UserRepository } from '@/repository';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  ResetPasswordPayload,
} from '../dto';
import jwt_decode from 'jwt-decode';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserWithOutPassword | null> {
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new NotFoundException(AUTH_MESSAGE.USER.NOT_FOUND);
    const isMatch = await checkIsMatchPassword(password, user.password);
    if (isMatch) return user;
    return null;
  }

  async login(user: UserWithOutPassword) {
    const { username, email, id, role } = user;
    const payload: PayloadTokenUser = { username, email, id, role };
    return this.jwtService.sign(payload);
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, password: rawPassword } = createUserDto;
    const queryEmail = email ? { email } : {};
    const checkUserInfor = await this.userRepository.findOne({
      where: [{ username }, queryEmail],
    });
    if (checkUserInfor) throw new ConflictException(AUTH_MESSAGE.USER.EXIST);
    const password = await hashedPassword(rawPassword);

    const rawNewUser = {
      ...createUserDto,
      password,
    };
    const token = this.jwtService.sign(rawNewUser);
    return this.mailerService.sendSubmitMail(email, username, token);
    // const newUser = await this.userRepository.save(rawNewUser);
    // if (email) {
    //   await this.mailerService.sendWelcomeMail(email, username);
    // }
    // return this.login(newUser);
  }

  async submitCreateNewUser(token: string): Promise<string> {
    const rawNewUser = jwtDecode(token);
    const newUser = await this.userRepository.save(rawNewUser);
    await this.mailerService.sendWelcomeMail(newUser.email, newUser.username);
    return this.login(newUser);
  }

  async changeUserPassword(
    changePasswordDto: ChangePasswordDto,
    username: string,
  ): Promise<string> {
    const { oldPassword, newPassword, confirmNewPassword } = changePasswordDto;
    if (newPassword !== confirmNewPassword)
      throw new ConflictException(AUTH_MESSAGE.USER.CONFIRM_PASSWORD);

    const checkValidateUser = await this.validateUser(username, oldPassword);
    if (!checkValidateUser)
      throw new NotFoundException(AUTH_MESSAGE.USER.WRONG_PASSWORD);
    const password = await hashedPassword(newPassword);
    const changedPasswordUser = await this.userRepository.save({
      ...checkValidateUser,
      password,
    });
    return this.login(changedPasswordUser);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { username, newPassword, confirmNewPassword } = forgetPasswordDto;
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new NotFoundException(AUTH_MESSAGE.USER.NOT_FOUND);
    if (newPassword !== confirmNewPassword)
      throw new ConflictException(AUTH_MESSAGE.USER.CONFIRM_PASSWORD);
    const password = await hashedPassword(newPassword);
    const expiredTime = getExpiredTime;
    const payload: ResetPasswordPayload = {
      username,
      password,
    };
    const tokenResetPassword = this.jwtService.sign(payload, {
      secret: JWT_EMAIL_CONFIG.secret,
      expiresIn: JWT_EMAIL_CONFIG.expiresIn,
    });
    return this.mailerService.sendResetPasswordMail(
      user.email,
      tokenResetPassword,
      username,
    );
  }

  async verifyResetPassword(tokenResetPassword: string) {
    const payload: ResetPasswordPayload = jwt_decode(tokenResetPassword);
    // const payload = this.jwtService.verify(tokenResetPassword, {
    //   secret: JWT_EMAIL_CONFIG.secret,
    //   ignoreExpiration: true,
    // });
    const { username, password } = payload;
    return this.userRepository;
  }
}
