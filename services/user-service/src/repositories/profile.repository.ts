import {
  type IUserProfile,
  UserProfileModel,
} from '../models/profile.model.js';

export class ProfileRepository {
  async findByUserId(userId: string) {
    return UserProfileModel.findOne({ userId });
  }

  async create(data: IUserProfile) {
    return UserProfileModel.create(data);
  }

  async updateByUserId(userId: string, data: Partial<IUserProfile>) {
    return UserProfileModel.findOneAndUpdate({ userId }, data, { new: true });
  }

  async deleteByUserId(userId: string) {
    return UserProfileModel.findOneAndDelete({ userId });
  }
}
