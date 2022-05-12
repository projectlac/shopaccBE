import { Injectable } from '@nestjs/common';
import * as reader from 'xlsx';
import { USER_ROLE } from './entity';
import { UserRepository } from './repository';
@Injectable()
export class AppService {
  constructor(private userRepository: UserRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  getDataFromExcel() {
    const file = reader.readFile('./db/oldUser.xlsx');
    const sheets = file.SheetNames;
    let data = [];
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach(({ username, email, phone, role }) => {
        const truePhone = phone ? +`0${phone}` : '';
        const trueRole = role === '1' ? USER_ROLE.ADMIN : USER_ROLE.USER;
        data.push({
          username,
          email,
          phone: truePhone,
          role: trueRole,
        });
      });
    }
    const listUsers = this.userRepository.create(data);
    return this.userRepository.save(listUsers);
  }
}
