import { type IUser, User } from '../models/user.model.js';
import { PaginatedResponse } from '../types/pagination.js';

type AdminUserFilter = {
  role: 'user';
  isActive?: boolean;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
};

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }); //isDeleted: false
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findOne({ _id: userId }); //isDeleted: false
  }

  async create(data: IUser): Promise<IUser> {
    return User.create(data);
  }

  async getAllUsersForAdmin({
    page,
    limit,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<IUser>> {
    const skip = (page - 1) * limit;

    const filter: AdminUserFilter = {
      role: 'user',
    };

    // 🔍 Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 🎯 Status filter
    if (status === 'Active') filter.isActive = true;
    if (status === 'Blocked') filter.isActive = false;

    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async toggleUserStatus(userId: string): Promise<IUser> {
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }

  async updateUser(
    userId: string,
    payload: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findOneAndUpdate({ _id: userId }, payload, {
      new: true,
    });
  }

  // async deleteUser(userId: string): Promise<IUser | null> {
  //   return User.findOneAndUpdate(
  //     { _id: userId, isDeleted: false },
  //     { isDeleted: true },
  //     { new: true },
  //   );
  // }
}
