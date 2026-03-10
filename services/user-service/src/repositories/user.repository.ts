import { Types } from 'mongoose';
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

  async updatePassword(userId: Types.ObjectId | string, password: string) {
    return User.findByIdAndUpdate(userId, { password }, { new: true });
  }

  async updateLastLogin(userId: Types.ObjectId | string) {
    return User.findByIdAndUpdate(
      userId,
      { last_login: new Date() },
      { new: true },
    );
  }

  async getUserInsights() {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // Total customers
    const totalCustomers = await User.countDocuments({
      role: 'user',
    });

    // New customers (last 7 days)
    const newCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: oneWeekAgo },
    });

    // VIP customers (example: you can adjust logic)
    // Here assuming users with more than 5 orders OR add vip flag later
    const vipCustomers = await User.countDocuments({
      role: 'user',
      isActive: true,
    });

    // Retention calculation (basic example)
    const activeUsers = await User.countDocuments({
      role: 'user',
      isActive: true,
    });

    const retentionRate = totalCustomers
      ? Math.round((activeUsers / totalCustomers) * 100)
      : 0;

    // Top 5 latest customers (temporary until you connect orders)
    const topCustomers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email')
      .lean();

    return {
      newCustomers,
      vipCustomers,
      totalCustomers,
      retentionRate,
      retentionGrowth: 2.4, // static for now
      topCustomers: topCustomers.map((user) => ({
        _id: user._id,
        name: user.name,
        totalOrders: 0, // update later when you connect orders
        totalSpent: 0,
      })),
    };
  }

  // async deleteUser(userId: string): Promise<IUser | null> {
  //   return User.findOneAndUpdate(
  //     { _id: userId, isDeleted: false },
  //     { isDeleted: true },
  //     { new: true },
  //   );
  // }
}
