import { compareTimeExpired } from './../util/common';
import {
  AUTH_MESSAGE,
  checkIsMatchPassword,
  EXPIRES_IN_MINUTE,
  hashedPassword,
  JWT_EMAIL_CONFIG,
} from '@/core/';
import { PayloadTokenUser, User, UserWithOutPassword, USER_ROLE } from '@/entity';
import { MailerService } from '@/mailer';
import { UserRepository } from '@/repository';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { default as jwtDecode, default as jwt_decode } from 'jwt-decode';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  ResetPasswordPayload,
  UpdateUserRoleDto,
} from '../dto';
import { getExpiredTime } from './../../mailer/util/common';
import { UpdateResult } from 'typeorm';

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
  }

  async submitCreateNewUser(token: string): Promise<string> {
    const rawNewUser = jwtDecode<User>(token);
    const checkExistUser = await this.userRepository.findOne({
      username: rawNewUser.username,
    });
    if (checkExistUser)
      throw new HttpException(AUTH_MESSAGE.USER.SUBMITTED, HttpStatus.ACCEPTED);
    const newUser = await this.userRepository.save({
      ...rawNewUser,
      confirmedEmail: true,
    });
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
    const expiredTime = getExpiredTime(EXPIRES_IN_MINUTE.FIVE_MINUTE);
    const payload: ResetPasswordPayload = {
      username,
      password,
      expiredTime,
    };
    const tokenResetPassword = this.jwtService.sign(payload);
    return this.mailerService.sendResetPasswordMail(
      user.email,
      tokenResetPassword,
      username,
    );
  }

  async verifyResetPassword(tokenResetPassword: string) {
    const payload: ResetPasswordPayload = jwt_decode(tokenResetPassword);
    const { username, password, expiredTime } = payload;
    if (!compareTimeExpired(expiredTime)) {
      throw new HttpException(
        AUTH_MESSAGE.TOKEN.EXPIRED,
        HttpStatus.REQUEST_TIMEOUT,
      );
    }
    return this.userRepository.update({ username }, { password });
  }

  async createAdminUser(createUserDto: CreateUserDto):Promise<User>{
    const password = await hashedPassword(createUserDto.password)
    const newAdmin = this.userRepository.create({
      ...createUserDto,
      password,
      role:USER_ROLE.ADMIN,
      confirmedEmail:true
    })
    return this.userRepository.save(newAdmin)
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto):Promise<UpdateResult>{
    const {username,role} = updateUserRoleDto
    const checkUser = await this.userRepository.findOne({username})
    if(!checkUser) throw new HttpException(AUTH_MESSAGE.USER.NOT_FOUND,HttpStatus.NOT_FOUND)
    return this.userRepository.update({username},{role})
  }

  async getAllUser():Promise<User[]>{
    return this.userRepository.find()
  }
}
