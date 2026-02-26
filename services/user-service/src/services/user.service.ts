import { IUser } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsersForAdmin(payload: {
    page: number;
    limit: number;
    search: string;
    status: string;
  }) {
    return this.userRepository.getAllUsersForAdmin(payload);
  }

  async getUserById(userId: string) {
    return this.userRepository.findById(userId);
  }

  async toggleUserStatus(userId: string) {
    return this.userRepository.toggleUserStatus(userId);
  }

  async updateUser(userId: string, payload: Partial<IUser>) {
    return this.userRepository.updateUser(userId, payload);
  }

  //   async deleteUser(userId: string) {
  //     return this.userRepository.deleteUser(userId);
  //   }
}
