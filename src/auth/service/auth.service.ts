import {
  AUTH_MESSAGE,
  checkIsMatchPassword,
  EXPIRES_IN_MINUTE,
  hashedPassword,
  DEFAULT_CONFIG,
  BaseQueryResponse,
} from '@/core/';
import {
  History,
  HISTORY_TYPE,
  PayloadTokenUser,
  User,
  UserWithOutPassword,
  USER_ROLE,
} from '@/entity';
import { HistoryService } from '@/history';
import { getExpiredTime, MailerService } from '@/mailer';
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
import { UpdateResult } from 'typeorm';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPasswordDto,
  QueryUserDto,
  UpdateUserRoleDto,
} from '../dto';
import { SubmitUserPayload, ResetPasswordPayload } from '../interface';
import { isTokenExpired } from '../util';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private historyService: HistoryService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new NotFoundException(AUTH_MESSAGE.USER.NOT_FOUND);
    const isMatch = await checkIsMatchPassword(password, user.password);
    if (isMatch) return user;
    return null;
  }

  async login(user: UserWithOutPassword) {
    const { id, email, username, phone, money, role } = user;
    const payload: PayloadTokenUser = {
      id,
      email,
      username,
      phone,
      money,
      role,
    };
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

    const expiredTime = getExpiredTime(EXPIRES_IN_MINUTE.THIRTY_MINUTE);
    const token = this.jwtService.sign({ rawNewUser, expiredTime });
    return this.mailerService.sendSubmitMail(email, username, token);
  }

  async submitCreateNewUser(token: string): Promise<string> {
    const { rawNewUser, expiredTime } = jwtDecode<SubmitUserPayload>(token);
    if (isTokenExpired(expiredTime)) {
      throw new HttpException(
        AUTH_MESSAGE.TOKEN.EXPIRED,
        HttpStatus.REQUEST_TIMEOUT,
      );
    }
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
    if (isTokenExpired(expiredTime)) {
      throw new HttpException(
        AUTH_MESSAGE.TOKEN.EXPIRED,
        HttpStatus.REQUEST_TIMEOUT,
      );
    }
    const user = await this.userRepository.findOne({ username });
    // await this.userRepository.update({ username }, { password });
    const changedPasswordUser = await this.userRepository.save({
      ...user,
      password,
    });
    return this.login(changedPasswordUser);
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    const password = await hashedPassword(createUserDto.password);
    const newAdmin = this.userRepository.create({
      ...createUserDto,
      password,
      role: USER_ROLE.ADMIN,
      confirmedEmail: true,
    });
    return this.userRepository.save(newAdmin);
  }

  async updateUserRole(
    user: User,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<[User, History]> {
    const { username, role } = updateUserRoleDto;
    const checkUser = await this.userRepository.findOne({ username });
    if (!checkUser)
      throw new HttpException(
        AUTH_MESSAGE.USER.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    return Promise.all([
      this.userRepository.save({ ...checkUser, role }),
      this.historyService.createHistoryChangeRole({
        admin: user.username,
        username,
        oldRole: checkUser.role,
        newRole: role,
      }),
    ]);
  }

  async getAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getAllUserList(
    queryUserDto: QueryUserDto,
  ): Promise<BaseQueryResponse<User>> {
    const {
      offset = DEFAULT_CONFIG.OFFSET,
      limit = DEFAULT_CONFIG.OFFSET,
      role = '',
      username = '',
    } = queryUserDto;
    const where = {};
    if (role) {
      where['role'] = role;
    }
    if (username) {
      where['username'] = username;
    }
    // const total = await this.userRepository.count({ where });
    // const data = await this.userRepository.find({
    //   take: limit,
    //   skip: offset,
    //   select: ['id', 'username', 'email', 'money', 'role'],
    //   where,
    //   order: {
    //     role: 'ASC',
    //     username: 'ASC',
    //   },
    // });
    const [total, data] = await Promise.all([
      this.userRepository.count({ where }),
      this.userRepository.find({
        take: limit,
        skip: offset,
        select: ['id', 'username', 'email', 'money', 'role'],
        where,
        order: {
          role: 'ASC',
          username: 'ASC',
        },
      }),
    ]);
    return {
      data,
      total,
    };
  }
}
