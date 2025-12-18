import { type   IUser, User } from "../models/user.model.ts";

export class UserRepository {
  findByEmail(email: string) {
    return User.findOne({ email });
  }

  create(data: IUser) {
    return User.create(data);
  }
}
