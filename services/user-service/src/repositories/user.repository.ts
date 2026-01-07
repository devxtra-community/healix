import { type IUser, User } from '../models/user.model.js';

export class UserRepository {
  findByEmail(email: string) {
    return User.findOne({ email });
  }

  findById(userId: string) {
    return User.findOne({ _id: userId });
  }

  create(data: IUser) {
    return User.create(data);
  }
}
