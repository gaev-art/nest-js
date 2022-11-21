import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UserDto } from './user.dto';
import { randomUUID } from 'crypto';

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
    const db = this.firebaseService.db;
    const q = db.collection('users');
    const newUser = { name: user.name, id: randomUUID() };
    await q.add(newUser).catch((e) => console.log(e));
    return { message: 'user created' };
  }
}
