import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UserDto } from './user.dto';
import { randomUUID } from 'crypto';
import { compareSync, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUser(): Promise<any> {
    const db = this.firebaseService.db;
    const q = db.collection('users');
    const docs = await q.get();
    return docs.docs.map((item) => item.data());
  }

  async createUser(user: UserDto): Promise<any> {
    try {
      const db = this.firebaseService.db;
      const q = db.collection('users');
      const hashedPassword = await hash(user.password, 12);

      const docs = await q.get();
      if (docs.docs.find((item) => item.data().name === user.name)) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'this name is taken!'
          },
          HttpStatus.FORBIDDEN
        );
      }

      const newUser = {
        name: user.name,
        id: randomUUID(),
        password: hashedPassword
      };
      await q.add(newUser).catch((e) => console.log(e));
      return { message: 'user created' };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'something went wrong, please try again!'
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e
        }
      );
    }
  }

  async login(user: UserDto): Promise<any> {
    try {
      const db = this.firebaseService.db;
      const q = db.collection('users');
      const docs = await q.get();
      return docs.docs
        .find(
          (item) =>
            compareSync(user.password, item.data().password) &&
            user.name === item.data().name
        )
        .data();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'incorrect login data!'
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e
        }
      );
    }
  }
}
